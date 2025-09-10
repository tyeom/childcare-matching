import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserMapper {
  // user model -> user.dto 변환
  toDto(userModel: User): UserDto {
    const userDto = plainToClass(UserDto, userModel);
    return userDto;
  }

  // user.dto -> user model 변환
  toEntity(userDto: UserDto): User {
    const userModel = new User();
    return Object.assign(userModel, userDto);
  }
}
