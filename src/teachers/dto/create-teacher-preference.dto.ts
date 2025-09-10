import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ArrayNotEmpty,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@app/common/base/dto/base.dto';

export class CreateTeacherPreferenceDto extends BaseDto {
  @ApiProperty({ description: '주소' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: '위도' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: '경도' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({
    description: '선호 지역',
    example: ['서울', '수원'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  preferredRegions: string[];

  @ApiProperty({
    description: '선호 지하철역',
    example: ['강남역', '수원역'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  preferredSubwayStations: string[];

  @ApiProperty({ description: '최대 이동 거리(km)', default: 5.0 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(50)
  maxDistance?: number = 5.0;
}
