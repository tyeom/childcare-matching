import { Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@app/common/enums/role-enum';
import { RBAC } from '@app/common/decorator/rbac.decorator';
import { User as UserDecorator } from '@app/common/decorator/user-decorator';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('seed')
  @RBAC(Role.ADMIN)
  @ApiOperation({ summary: '기본 데이터 생성' })
  create(@UserDecorator() user: UserDto) {
    return this.adminService.createSeed(user);
  }
}
