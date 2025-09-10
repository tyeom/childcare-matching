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

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    @InjectRepository(ParentAddress)
    private readonly parentAddressRepository: Repository<ParentAddress>,
    private readonly userMapper: UserMapper,
  ) {}

  private async getJobPostWithAddresses(
    jobId: number,
    user: UserDto,
  ): Promise<JobPost | null> {
    return await this.jobPostRepository.findOne({
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

  async updateJobPost(
    jobId: number,
    updateDto: UpdateJobPostDto,
    user: UserDto,
  ) {
    const jobPost = await this.jobPostRepository.findOne({
      where: {
        id: jobId,
        createdBy: { id: user.id },
        isDeleted: Raw((alias) => `${alias} = false OR ${alias} IS NULL`),
      },
    });

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
    const jobPost = await this.jobPostRepository.findOne({
      where: {
        id: jobId,
        createdBy: { id: user.id },
        isDeleted: Raw((alias) => `${alias} = false OR ${alias} IS NULL`),
      },
    });

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
}
