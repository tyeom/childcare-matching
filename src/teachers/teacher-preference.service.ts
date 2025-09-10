import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherPreferenceDto } from './dto/create-teacher-preference.dto';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherPreference } from './entities/teacher-preference.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UpdateTeacherPreferenceDto } from './dto/update-teacher-preference.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';

@Injectable()
export class TeacherPreferenceService {
  constructor(
    @InjectRepository(TeacherPreference)
    private readonly preferenceRepository: Repository<TeacherPreference>,
    private readonly userMapper: UserMapper,
  ) {}

  async findPreferenceByCreateBy(userId: number) {
    const preference = this.preferenceRepository.findOne({
      where: [
        { isDeleted: false, createdBy: { id: userId } },
        { isDeleted: IsNull(), createdBy: { id: userId } },
      ],
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
}
