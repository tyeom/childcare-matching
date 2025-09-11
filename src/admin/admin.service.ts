import { AlertPreferenceType, StudentLevel } from '@app/common/enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobPostDto } from 'src/parent/dto/create-Job-post.dto';
import { CreateParentAddressDto } from 'src/parent/dto/create-parent-address.dto';
import { JobPostService } from 'src/parent/job-post.service';
import { CreateTeacherPreferenceDto } from 'src/teachers/dto/create-teacher-preference.dto';
import { TeacherPreferenceService } from 'src/teachers/teacher-preference.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly usersService: UsersService,
    private readonly jobPostService: JobPostService,
    private readonly teacherPreferenceService: TeacherPreferenceService,
  ) {}

  async createSeed(user: UserDto) {
    const parents1User = await this.usersService.findOneByUserId('parents1');
    const parents2User = await this.usersService.findOneByUserId('parents2');
    const teacher1User = await this.usersService.findOneByUserId('teacher1');
    const teacher2User = await this.usersService.findOneByUserId('teacher2');

    if (!parents1User || !parents2User || !teacher1User || !teacher2User)
      throw new BadRequestException('기본 계정이 생성 되지 않았습니다.');

    // 선생님1 선호사항 등록
    const createTeacherPreferenceDto1 = new CreateTeacherPreferenceDto();
    createTeacherPreferenceDto1.address = '서울시 강남구 삼성동 158-16';
    createTeacherPreferenceDto1.preferredRegions = ['서울'];
    createTeacherPreferenceDto1.preferredSubwayStations = [
      '강남',
      '역삼',
      '수서',
    ];
    createTeacherPreferenceDto1.alertPreferenceType =
      AlertPreferenceType.ADDRESS;
    await this.teacherPreferenceService.createPreference(
      createTeacherPreferenceDto1,
      this.userMapper.toDto(teacher1User),
    );

    // 선생님2 선호사항 등록
    const createTeacherPreferenceDto2 = new CreateTeacherPreferenceDto();
    createTeacherPreferenceDto2.address =
      '경기도 성남시 분당구 불정로 6 그린팩토리';
    createTeacherPreferenceDto2.preferredRegions = ['용인', '수원', '화성'];
    createTeacherPreferenceDto2.preferredSubwayStations = ['서울', '사당'];
    createTeacherPreferenceDto2.alertPreferenceType =
      AlertPreferenceType.SUBWAY_STATIONS;
    await this.teacherPreferenceService.createPreference(
      createTeacherPreferenceDto2,
      this.userMapper.toDto(teacher2User),
    );

    // 학부모 공고 주소
    const createParentAddressDto1 = new CreateParentAddressDto();
    createParentAddressDto1.cityProvince = '서울';
    createParentAddressDto1.district = '강남구';
    createParentAddressDto1.detailedAddress = '테헤란로 501 브이플렉스';
    createParentAddressDto1.addressType = 'PRIMARY';

    const createParentAddressDto2 = new CreateParentAddressDto();
    createParentAddressDto2.cityProvince = '서울';
    createParentAddressDto2.district = '동작구';
    createParentAddressDto2.detailedAddress = '동작대로5길 8 1층';
    createParentAddressDto2.addressType = 'PRIMARY';

    const createParentAddressDto3 = new CreateParentAddressDto();
    createParentAddressDto3.cityProvince = '서울';
    createParentAddressDto3.district = '중구';
    createParentAddressDto3.detailedAddress = '세종대로 14 그랜드센트럴 3F';
    createParentAddressDto3.addressType = 'PRIMARY';

    const createParentAddressDto4 = new CreateParentAddressDto();
    createParentAddressDto4.cityProvince = '경기도';
    createParentAddressDto4.district = '용인';
    createParentAddressDto4.detailedAddress = '처인구 포곡읍 전대리 310';
    createParentAddressDto4.addressType = 'PRIMARY';

    // 학부모1 JobPost 등록
    const createJobPostDto1 = new CreateJobPostDto();
    createJobPostDto1.title = '공고 1';
    createJobPostDto1.jobDetails = '상세 내용 1';
    createJobPostDto1.studentLevel = StudentLevel.PRESCHOOLER;
    createJobPostDto1.sessionDuration = 40;
    createJobPostDto1.preferredDays = ['월', '수', '금'];
    createJobPostDto1.preferredStartTime = '12:00';
    createJobPostDto1.addresses = [
      createParentAddressDto1,
      createParentAddressDto2,
    ];
    await this.jobPostService.createJobPost(
      createJobPostDto1,
      this.userMapper.toDto(parents1User),
    );

    // 학부모2 JobPost 등록
    const createJobPostDto2 = new CreateJobPostDto();
    createJobPostDto2.title = '공고 2';
    createJobPostDto2.jobDetails = '상세 내용 2';
    createJobPostDto2.studentLevel = StudentLevel.ELEMENTARY;
    createJobPostDto2.sessionDuration = 60;
    createJobPostDto2.preferredDays = ['월', '화'];
    createJobPostDto2.preferredStartTime = '09:00';
    createJobPostDto2.addresses = [
      createParentAddressDto3,
      createParentAddressDto4,
    ];
    await this.jobPostService.createJobPost(
      createJobPostDto2,
      this.userMapper.toDto(parents2User),
    );
  }
}
