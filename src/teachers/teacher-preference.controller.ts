import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Put,
  Delete,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { TeacherPreferenceService } from './teacher-preference.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { CreateTeacherPreferenceDto } from './dto/create-teacher-preference.dto';
import { Role } from '@app/common/enums/role-enum';
import { RBAC } from '@app/common/decorator/rbac.decorator';
import { User as UserDecorator } from '@app/common/decorator/user-decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { UpdateTeacherPreferenceDto } from './dto/update-teacher-preference.dto';

@Controller('teachers-preference')
@ApiBearerAuth()
export class TeacherPreferenceController {
  constructor(
    private readonly teacherPreferenceService: TeacherPreferenceService,
  ) {}

  @Post()
  @RBAC(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: '선생님 선호사항 등록' })
  @ApiBody({
    type: CreateTeacherPreferenceDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '선호사항이 성공적으로 등록되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 선호사항이 등록되어 있습니다.',
  })
  async createPreference(
    @Body() createDto: CreateTeacherPreferenceDto,
    @UserDecorator() user: UserDto,
  ) {
    return await this.teacherPreferenceService.createPreference(
      createDto,
      user,
    );
  }

  @Get()
  @RBAC(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: '선생님 선호사항 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '선호사항 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '선호사항을 찾을 수 없습니다.',
  })
  async getPreference(@UserDecorator() user: UserDto) {
    const preference =
      await this.teacherPreferenceService.findPreferenceByCreateBy(user.id);

    if (!preference) {
      throw new NotFoundException('선호사항을 찾을 수 없습니다.');
    }

    return preference;
  }

  @Put()
  @RBAC(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: '선생님 선호사항 수정' })
  @ApiBody({
    type: UpdateTeacherPreferenceDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '선호사항이 성공적으로 수정되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '선호사항을 찾을 수 없습니다.',
  })
  async updatePreference(
    @Body() updateDto: UpdateTeacherPreferenceDto,
    @UserDecorator() user: UserDto,
  ) {
    return await this.teacherPreferenceService.updatePreference(
      updateDto,
      user,
    );
  }

  @Delete()
  @RBAC(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: '선생님 선호사항 삭제' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '선호사항이 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '선호사항을 찾을 수 없습니다.',
  })
  async deletePreference(@UserDecorator() user: UserDto) {
    return await this.teacherPreferenceService.deletePreference(user);
  }
}
