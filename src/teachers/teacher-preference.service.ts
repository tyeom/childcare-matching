import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherPreferenceDto } from './dto/create-teacher-preference.dto';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherPreference } from './entities/teacher-preference.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UpdateTeacherPreferenceDto } from './dto/update-teacher-preference.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';
import { TeacherPreferenceResponseDto } from './dto/teacher-preference-response.dto';
import { LOCAL_SEARCH_ADDRESS_TOKEN } from './providers/local-search-address.provider';
import { LocalSearchAddress } from '@app/common/external-apis/local-search-address';
import { ParentAddress } from 'src/parent/entities/parent-address.entity';
import { AlertPreferenceType } from '@app/common/enums/alert-preference-type.enum';
import { METRO_LAT_LNG_TOKEN } from './providers/search-metro-lat-lng.provider';
import { SearchMetro } from '@app/common/utils/metro-lat-lng.util';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TeacherPreferenceService {
  /**
   * 지하철역 최대 거리 (km)
   */
  private readonly subwayStationsMaxDistance: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(TeacherPreference)
    private readonly preferenceRepository: Repository<TeacherPreference>,
    private readonly userMapper: UserMapper,
    @Inject(LOCAL_SEARCH_ADDRESS_TOKEN)
    private readonly localSearchAddress: LocalSearchAddress,
    @Inject(METRO_LAT_LNG_TOKEN)
    private readonly searchMetro: SearchMetro,
  ) {
    this.subwayStationsMaxDistance = this.configService.getOrThrow<number>(
      'MATCHING_SUBWAY_STATIONS_NAX_DISTANCE',
    );
  }

  /**
   * 두 지점 간의 거리 계산
   *
   * (Haversine 공식)
   *
   * @param lat1 첫번째 지점 위도
   * @param lon1 첫번째 지점 경도
   * @param lat2 두번째 지점 위도
   * @param lon2 두번째 지점 경도
   * @returns 두 지점간 거리
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    // 지구 반지름 (km)
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  /**
   * 라디안 각도 계산
   * @param deg 각도
   * @returns 결과
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * 선호 주소 기준으로 거리 체크
   *
   * @param teacherLat 선생님 선호 주소 위도
   * @param teacherLon 선생님 선호 주소 경도도
   * @param jobAddrLatitude 공고 주소 위도
   * @param jobAddrLongitude 공고 주소 경도
   * @param maxDistance 최대 제한 거리
   * @returns 거리 가능 여부
   */
  private checkAddressMatching(
    teacherLat: number,
    teacherLon: number,
    jobAddrLatitude: number,
    jobAddrLongitude: number,
    maxDistance: number,
  ) {
    const distance = this.calculateDistance(
      teacherLat,
      teacherLon,
      jobAddrLatitude,
      jobAddrLongitude,
    );
    return distance <= maxDistance;
  }

  /**
   * 선호 지하철 기준으로 거리 체크
   *
   * @param subwayStationName 지하철역 이름
   * @param jobAddrLatitude 공고 주소 위도
   * @param jobAddrLongitude 공고 주소 경도
   * @returns 거리 가능 여부
   */
  private async checkSubwayStation(
    subwayStationName: string,
    jobAddrLatitude: number,
    jobAddrLongitude: number,
  ) {
    const { lat, lng } = (await this.searchMetro.getMetroLatLng(
      subwayStationName,
    )) ?? {
      lat: '',
      lng: '',
    };
    if (!lat || !lng) {
      console.log('지하철 좌표 변환 오류');
      return false;
    }

    const targetLat = Number(lat);
    const targetLon = Number(lng);
    const distance = this.calculateDistance(
      targetLat,
      targetLon,
      jobAddrLatitude,
      jobAddrLongitude,
    );
    return distance <= this.subwayStationsMaxDistance;
  }

  private async checkDistance(
    lat: number,
    lon: number,
    parentAddress: ParentAddress,
    teacherPreference: TeacherPreference,
  ): Promise<boolean> {
    if (
      // 주소 기준 거리 비교
      teacherPreference.alertPreferenceType === AlertPreferenceType.ADDRESS &&
      teacherPreference.address
    ) {
      // 비교 대상 좌표
      let targetLat: number;
      let targetLon: number;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const addressInfo = await this.localSearchAddress.getAddressInfo(
        teacherPreference.address,
      );
      if (!addressInfo)
        throw new InternalServerErrorException(
          '주소지 좌표 변환 오류 - 선생님 주소',
        );

      const { lat: teacherAddressLat, lon: teacherAddressLon } =
        this.localSearchAddress.extractLatLon(addressInfo) ?? {
          lat: '',
          lon: '',
        };
      if (teacherAddressLat && teacherAddressLon) {
        targetLat = Number(teacherAddressLat);
        targetLon = Number(teacherAddressLon);

        return this.checkAddressMatching(
          targetLat,
          targetLon,
          lat,
          lon,
          teacherPreference.maxDistance,
        );
      }
    } else if (
      // 지하철역 기준 거리 비교
      teacherPreference.alertPreferenceType ===
        AlertPreferenceType.SUBWAY_STATIONS &&
      teacherPreference.preferredSubwayStations &&
      teacherPreference.preferredSubwayStations.length > 0
    ) {
      const results = await Promise.allSettled(
        teacherPreference.preferredSubwayStations.map((subwayStation) =>
          this.checkSubwayStation(subwayStation, lat, lon),
        ),
      );
      const isMetroMatch = results.some(
        (result) => result.status === 'fulfilled' && result.value,
      );
      return isMetroMatch;
    } else if (
      // 지역 기준 비교
      teacherPreference.alertPreferenceType === AlertPreferenceType.REGIONS &&
      teacherPreference.preferredRegions &&
      teacherPreference.preferredRegions.length > 0 &&
      parentAddress
    ) {
      const isCityMatch = teacherPreference.preferredRegions.some((region) =>
        parentAddress.cityProvince.includes(region),
      );
      // 선호 지역(시)에 일치하면 true
      return isCityMatch;
    }

    return false;
  }

  async findPreferenceByCreateBy(userId: number) {
    const preference = this.preferenceRepository.findOne({
      where: {
        createdBy: { id: userId },
        isDeleted: Raw((alias) => `${alias} = false OR ${alias} IS NULL`),
      },
    });

    return preference;
  }

  async createPreference(createDto: CreateTeacherPreferenceDto, user: UserDto) {
    // 이미 선호사항이 있는지 확인
    const existingPreference = await this.findPreferenceByCreateBy(user.id);

    if (existingPreference) {
      throw new ConflictException('이미 선호사항이 등록되어 있습니다.');
    }

    // 선호사항 생성
    createDto.createdBy = user;
    createDto.modifiedBy = user;
    const preference = this.preferenceRepository.create(createDto);

    const savedPreference = await this.preferenceRepository.save(preference);
    return savedPreference;
  }

  async updatePreference(updateDto: UpdateTeacherPreferenceDto, user: UserDto) {
    const preference = await this.findPreferenceByCreateBy(user.id);

    if (!preference) {
      throw new NotFoundException('선호사항을 찾을 수 없습니다.');
    }

    // 업데이트
    updateDto.modifiedBy = user;
    Object.assign(preference, updateDto);
    const updatedPreference = await this.preferenceRepository.save(preference);
    return updatedPreference;
  }

  async deletePreference(user: UserDto) {
    const preference = await this.findPreferenceByCreateBy(user.id);

    if (!preference) {
      throw new NotFoundException('선호사항을 찾을 수 없습니다.');
    }

    // 삭제
    preference.isDeleted = true;
    preference.modifiedBy = this.userMapper.toEntity(user);
    const updatedPreference = await this.preferenceRepository.save(preference);
    return updatedPreference;
  }

  /**
   * 선호 지역 기준으로 선생님 조회
   * @param parentAddress 공고 등록 주소지
   * @returns 검색된 선생님 선호 지역 결과
   */
  async findTeachersWithinDistance(
    parentAddress: ParentAddress,
  ): Promise<TeacherPreferenceResponseDto[]> {
    // 주소지 좌표로 변환
    const address = `${parentAddress.cityProvince} ${parentAddress.district} ${parentAddress.detailedAddress}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const addressInfo = await this.localSearchAddress.getAddressInfo(address);
    if (!addressInfo)
      throw new InternalServerErrorException('주소지 좌표 변환 요청 오류');

    const { lat, lon } = this.localSearchAddress.extractLatLon(addressInfo) ?? {
      lat: '',
      lon: '',
    };

    if (!lat || !lon)
      throw new InternalServerErrorException('주소지 좌표 변환 오류');

    // 등록된 모든 선생님 선호 지역
    const preferences = await this.preferenceRepository.find({
      where: {
        isDeleted: Raw((alias) => `${alias} = false OR ${alias} IS NULL`),
      },
      relations: ['createdBy'],
    });

    const checks = await Promise.allSettled(
      preferences.map((preference) =>
        this.checkDistance(Number(lat), Number(lon), parentAddress, preference),
      ),
    );

    // checks[idx]가 true인 것만 통과
    return preferences
      .filter(
        (_, idx) => checks[idx].status === 'fulfilled' && checks[idx].value,
      )
      .map((preference) => this.mapToResponseDto(preference));
  }

  private mapToResponseDto(
    preference: TeacherPreference,
  ): TeacherPreferenceResponseDto {
    return plainToInstance(TeacherPreferenceResponseDto, {
      id: preference.id,
      teacherId: preference.createdBy.id,
      teacherName: preference.createdBy.userName,
      teacherPhone: preference.createdBy.phone,
      address: preference.address,
      preferredRegions: preference.preferredRegions,
      preferredSubwayStations: preference.preferredSubwayStations,
      alertPreferenceType: preference.alertPreferenceType,
      maxDistance: Number(preference.maxDistance),
      createdAt: preference.createdAt,
      modifiedAt: preference.modifiedAt,
    });
  }
}
