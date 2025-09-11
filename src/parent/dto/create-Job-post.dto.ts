import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StudentLevel } from '@app/common/enums';
import { BaseDto } from '@app/common/base/dto';
import { Type } from 'class-transformer';
import { CreateParentAddressDto } from './create-parent-address.dto';

export class CreateJobPostDto extends BaseDto {
  @ApiProperty({ description: '공고 제목' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @ApiProperty({ description: '공고 상세 내용' })
  @IsString()
  @IsNotEmpty()
  jobDetails: string;

  @ApiProperty({ description: '학생 레벨', enum: StudentLevel })
  @IsEnum(StudentLevel)
  studentLevel: StudentLevel;

  @ApiProperty({ description: '수업 시간(분)' })
  @IsNumber()
  @Min(40)
  @Max(240)
  sessionDuration: number;

  @ApiProperty({
    description: '선호 요일',
    example: ['월', '수', '금'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  preferredDays: string[];

  @ApiProperty({
    description: '선호 시작 시간 (HH:MM)',
    example: '14:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferredStartTime?: string;

  @ApiProperty({ description: '요구사항', required: false })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({
    description: '수업 가능 주소 목록 (최소 1개, 최대 5개)',
    type: [CreateParentAddressDto],
    minItems: 1,
    maxItems: 5,
  })
  @IsArray()
  @ArrayMinSize(1, { message: '최소 1개의 주소가 필요합니다.' })
  @ArrayMaxSize(5, { message: '최대 5개까지 주소 등록이 가능합니다.' })
  @ValidateNested({ each: true })
  @Type(() => CreateParentAddressDto)
  addresses: CreateParentAddressDto[];
}
