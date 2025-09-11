import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateParentAddressDto } from './create-parent-address.dto';

export class AddAddressDto {
  @ApiProperty({
    description: '추가할 주소 정보',
    type: CreateParentAddressDto,
  })
  @ValidateNested()
  @Type(() => CreateParentAddressDto)
  address: CreateParentAddressDto;
}
