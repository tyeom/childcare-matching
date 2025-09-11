import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Put,
  Delete,
  Get,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { Role } from '@app/common/enums/role-enum';
import { RBAC } from '@app/common/decorator/rbac.decorator';
import { User as UserDecorator } from '@app/common/decorator/user-decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-Job-post.dto';
import { UpdateJobPostDto } from './dto/update-Job-post.dto';
import { AddAddressDto } from './dto/add-address.dto';

@Controller('job-post')
@ApiBearerAuth()
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({ summary: '부모님 공고 등록' })
  @ApiBody({
    type: CreateJobPostDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '공고가 성공적으로 등록되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '입력 데이터가 올바르지 않습니다.',
  })
  async createJobPost(
    @Body() createDto: CreateJobPostDto,
    @UserDecorator() user: UserDto,
  ) {
    return await this.jobPostService.createJobPost(createDto, user);
  }

  /// TODO : 검색 필터 및 페이징 처리 필요
  @Get()
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({ summary: '공고 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '공고 목록 조회 성공',
  })
  async searchJobPosts(@UserDecorator() user: UserDto) {
    return await this.jobPostService.searchJobPosts(user);
  }

  @Get(':jobId')
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({ summary: '공고 상세 조회 (모든 주소 포함)' })
  @ApiParam({ name: 'jobId', description: '공고 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '공고 상세 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '공고를 찾을 수 없습니다.',
  })
  async getJobPost(
    @Param('jobId', ParseIntPipe) jobId: number,
    @UserDecorator() user: UserDto,
  ) {
    return await this.jobPostService.getJobPost(jobId, user);
  }

  @Put(':jobId')
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({ summary: '공고 수정' })
  @ApiParam({ name: 'jobId', description: '공고 ID' })
  @ApiBody({
    type: UpdateJobPostDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '공고가 성공적으로 수정되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '공고를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '수정할 수 없는 상태입니다.',
  })
  async updateJobPost(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() updateDto: UpdateJobPostDto,
    @UserDecorator() user: UserDto,
  ) {
    return await this.jobPostService.updateJobPost(jobId, updateDto, user);
  }

  @Delete(':jobId')
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({ summary: '공고 삭제' })
  @ApiParam({ name: 'jobId', description: '공고 ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '공고가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '공고를 찾을 수 없습니다.',
  })
  async deleteJobPost(
    @Param('jobId', ParseIntPipe) jobId: number,
    @UserDecorator() user: UserDto,
  ) {
    return await this.jobPostService.deleteJobPost(jobId, user);
  }

  @Post(':jobId/addresses')
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({ summary: '공고에 주소 추가' })
  @ApiParam({ name: 'jobId', description: '공고 ID' })
  @ApiBody({
    type: AddAddressDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '주소가 성공적으로 추가되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '최대 5개까지 주소 등록이 가능합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '공고를 찾을 수 없습니다.',
  })
  async addAddressToJobPost(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() addAddressDto: AddAddressDto,
    @UserDecorator() user: UserDto,
  ) {
    return await this.jobPostService.addAddressToJobPost(
      jobId,
      addAddressDto,
      user,
    );
  }

  @Delete(':jobId/addresses/:addressId')
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({ summary: '공고에서 주소 삭제' })
  @ApiParam({ name: 'jobId', description: '공고 ID' })
  @ApiParam({ name: 'addressId', description: '주소 ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '주소가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '최소 1개의 주소는 유지되어야 합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '공고 또는 주소를 찾을 수 없습니다.',
  })
  async removeAddressFromJobPost(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @UserDecorator() user: UserDto,
  ) {
    return await this.jobPostService.removeAddressFromJobPost(
      jobId,
      addressId,
      user,
    );
  }

  @Get(':jobId/matching-teachers')
  @RBAC(Role.ADMIN, Role.PARENTS)
  @ApiOperation({
    summary: '공고 추천 대상 선생님 조회 (공고에 등록된 주소 기준)',
  })
  @ApiParam({ name: 'jobId', description: '공고 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '추천 대상 선생님 목록 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '공고를 찾을 수 없습니다.',
  })
  async findMatchingTeachers(
    @Param('jobId', ParseIntPipe) jobId: number,
    @UserDecorator() user: UserDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.jobPostService.findMatchingTeachers(jobId, user);
  }
}
