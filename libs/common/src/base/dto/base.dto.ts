import { ApiHideProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export abstract class BaseDto {
  @ApiHideProperty()
  isDeleted: boolean;
  @ApiHideProperty()
  createdBy: UserDto;
  @ApiHideProperty()
  modifiedBy: UserDto;
}
