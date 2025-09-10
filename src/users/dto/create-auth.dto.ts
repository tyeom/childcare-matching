import { ForbiddenRole } from '@app/common/decorator/forbidden-role.decorator';
import { Role } from '@app/common/enums';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @ForbiddenRole([Role.ADMIN], { message: 'ADMIN은 허용되지 않습니다.' })
  role: Role;
}
