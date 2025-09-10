import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
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

  @ApiProperty({ description: '우편번호' })
  @IsString()
  @Length(5, 10)
  postalCode: string;

  @ApiProperty({ description: '위도', required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ description: '경도', required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({
    description: '주소 타입',
    default: 'PRIMARY',
  })
  @IsOptional()
  @IsString()
  addressType?: string = 'PRIMARY';
}
