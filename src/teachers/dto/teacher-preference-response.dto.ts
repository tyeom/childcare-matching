import { AlertPreferenceType } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TeacherPreferenceResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  teacherId: number;

  @ApiProperty()
  teacherName: string;

  @ApiProperty()
  teacherPhone: string;

  @Exclude()
  @ApiProperty()
  address: string;

  @Exclude()
  @ApiProperty()
  preferredRegions: string[];

  @Exclude()
  @ApiProperty()
  preferredSubwayStations: string[];

  @ApiProperty({ description: '선호 알림 타입', enum: AlertPreferenceType })
  alertPreferenceType: AlertPreferenceType;

  @Exclude()
  @ApiProperty()
  maxDistance: number;

  @Exclude()
  @ApiProperty()
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  modifiedAt: Date;
}
