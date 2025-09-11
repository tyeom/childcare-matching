import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@app/common/base/dto';

export class CreateParentAddressDto extends BaseDto {
  @ApiProperty({ description: '상세주소' })
  @IsString()
  @IsNotEmpty()
  detailedAddress: string;

  @ApiProperty({ description: '구/군/시' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: '시/도' })
  @IsString()
  @IsNotEmpty()
  cityProvince: string;

  @ApiProperty({
    description: '주소 타입',
    default: 'PRIMARY',
  })
  @IsOptional()
  @IsString()
  addressType?: string = 'PRIMARY';
}
