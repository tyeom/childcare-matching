import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/users/dto/user.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';
import { Raw, Repository } from 'typeorm';
import { CreateJobPostDto } from './dto/create-Job-post.dto';
import { JobStatus } from '@app/common/enums';
import { JobPost } from './entities/job-post.entity';
import { ParentAddress } from './entities/parent-address.entity';
import { UpdateJobPostDto } from './dto/update-Job-post.dto';
import { AddAddressDto } from './dto/add-address.dto';
import { TeacherPreferenceService } from 'src/teachers/teacher-preference.service';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    @InjectRepository(ParentAddress)
    private readonly parentAddressRepository: Repository<ParentAddress>,
    private readonly userMapper: UserMapper,
    private readonly teacherPreferenceService: TeacherPreferenceService,
  ) {}

  private async getJobPostWithAddresses(
    jobId: number,
    user: UserDto,
  ): Promise<JobPost | null> {
    return this.jobPostRepository.findOne({
      where: {
        id: jobId,
        createdBy: { id: user.id },
        isDeleted: Raw((alias) => `${alias} = false OR ${alias} IS NULL`),
      },
      relations: ['addresses'],
    });
  }

  async createJobPost(createDto: CreateJobPostDto, user: UserDto) {
    createDto.createdBy = user;
    createDto.modifiedBy = user;

    const { addresses, ...jobPostData } = createDto;

    // 1. 최초 공고 등록 [상태 => ACTIVE]
    const jobPost = this.jobPostRepository.create({
      ...jobPostData,
      status: JobStatus.ACTIVE,
    });

    const savedJobPost = await this.jobPostRepository.save(jobPost);

    // 2. 주소 생성 [여러 주소 등록]
    const parentAddresses = addresses.map((addressDto) =>
      this.parentAddressRepository.create({
        ...addressDto,
        createdBy: user,
        modifiedBy: user,
        jobPost: jobPost,
      }),
    );
    await this.parentAddressRepository.save(parentAddresses);

    // 3. 공고와 주소 정보 함께 조회
    const jobPostWithAddresses = await this.getJobPostWithAddresses(
      savedJobPost.id,
      user,
    );

    // 4. 매칭 가능한 선생님들에게 알림 (비동기)
    // this.notifyMatchingTeachers(jobPostWithAddresses).catch(error => {
    //   console.error('Failed to notify teachers:', error);
    // });

    return jobPostWithAddresses;
  }

  async searchJobPosts(user: UserDto) {
    const queryBuilder = this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.addresses', 'addresses')
      .where('(jobPost.isDeleted = false OR jobPost.isDeleted IS NULL)');
    // where
    // 로그인 인증된 유저의 데이터만 조회
    queryBuilder.andWhere('jobPost.createdBy = :createdBy', {
      createdBy: user.id,
    });

    const [jobPosts, total] = await queryBuilder.getManyAndCount();

    return {
      jobPosts: jobPosts,
      total,
    };
  }

  async getJobPost(jobId: number, user: UserDto) {
    const jobPost = await this.getJobPostWithAddresses(jobId, user);

    if (!jobPost) {
      throw new NotFoundException('공고를 찾을 수 없습니다.');
    }

    return jobPost;
  }

  async findOneById(jobId: number, user: UserDto) {
    const jobPost = this.jobPostRepository.findOne({
      where: {
        id: jobId,
        createdBy: { id: user.id },
        isDeleted: Raw((alias) => `${alias} = false OR ${alias} IS NULL`),
      },
    });
    return jobPost;
  }

  async updateJobPost(
    jobId: number,
    updateDto: UpdateJobPostDto,
    user: UserDto,
  ) {
    const jobPost = await this.findOneById(jobId, user);

    if (!jobPost) {
      throw new NotFoundException('공고를 찾을 수 없습니다.');
    }

    // 매칭된 공고 또는 공고가 완료된 상태는 수정 불가능
    if (jobPost.status === JobStatus.MATCHED) {
      throw new BadRequestException('매칭된 공고는 수정 할 수 없습니다.');
    }
    if (jobPost.status === JobStatus.COMPLETED) {
      throw new BadRequestException('완료된 공고는 수정 할 수 없습니다.');
    }

    Object.assign(jobPost, updateDto);
    await this.jobPostRepository.save(jobPost);

    return await this.getJobPostWithAddresses(jobId, user);
  }

  async deleteJobPost(jobId: number, user: UserDto) {
    const jobPost = await this.findOneById(jobId, user);

    if (!jobPost) {
      throw new NotFoundException('공고를 찾을 수 없습니다.');
    }

    // 매칭된 공고 상태는 삭제 불가능
    if (jobPost.status === JobStatus.MATCHED) {
      throw new BadRequestException('매칭된 공고는 삭제 할 수 없습니다.');
    }

    // 삭제
    jobPost.isDeleted = true;
    jobPost.modifiedBy = this.userMapper.toEntity(user);
    const updatedJobPost = await this.jobPostRepository.save(jobPost);
    return updatedJobPost;
  }

  async addAddressToJobPost(
    jobId: number,
    addAddressDto: AddAddressDto,
    user: UserDto,
  ) {
    const jobPost = await this.findOneById(jobId, user);

    if (!jobPost) {
      throw new NotFoundException('공고를 찾을 수 없습니다.');
    }

    if (jobPost.addresses.length >= 5) {
      throw new BadRequestException('최대 5개까지 주소 등록이 가능합니다.');
    }

    addAddressDto.address.createdBy = user;
    addAddressDto.address.modifiedBy = user;

    const newAddress = this.parentAddressRepository.create({
      ...addAddressDto.address,
      jobPost: jobPost,
    });

    const savedAddress = await this.parentAddressRepository.save(newAddress);
    return savedAddress;
  }

  async removeAddressFromJobPost(
    jobId: number,
    addressId: number,
    user: UserDto,
  ) {
    const jobPost = await this.findOneById(jobId, user);

    if (!jobPost) {
      throw new NotFoundException('공고를 찾을 수 없습니다.');
    }

    if (jobPost.addresses.length <= 1) {
      throw new BadRequestException('최소 1개의 주소는 유지되어야 합니다.');
    }

    const result = await this.parentAddressRepository.delete({
      id: addressId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('주소를 찾을 수 없습니다.');
    }
  }

  /**
   * 공고에 등록된 주소 기준으로 추천 선생님 조회
   * @param jobKey 공고 Id
   * @param user 요청된 유저 정보
   * @returns 추천 선생님 결과
   */
  async findMatchingTeachers(jobId: number, user: UserDto) {
    const jobPost = await this.getJobPostWithAddresses(jobId, user);

    if (!jobPost || !jobPost.addresses || jobPost.addresses.length === 0) {
      throw new NotFoundException('공고 또는 주소 정보를 찾을 수 없습니다.');
    }

    // 추천 선생님 목록
    const allMatchingTeachers = new Map();

    // 각 주소별로 매칭 가능한 선생님 찾기 [주소 기준 추천]
    for (const address of jobPost.addresses) {
      // 상세 주소가 하나도 없는 경우 제외
      if (
        !address ||
        (!address.cityProvince && !address.district && !address.detailedAddress)
      ) {
        continue;
      }

      try {
        const foundTeachers =
          await this.teacherPreferenceService.findTeachersWithinDistance(
            address,
          );

        foundTeachers.forEach((teacher) => {
          if (!allMatchingTeachers.has(teacher.teacherId)) {
            allMatchingTeachers.set(teacher.teacherId, {
              ...teacher,
              /// TODO : 여기에 거리 정보, 주소 정보도 같이 포함되면 좋을 것 같음.
            });
          }
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Array.from(allMatchingTeachers.values());
  }
}
