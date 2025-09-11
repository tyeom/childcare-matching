import { BaseEntity } from '@app/common/base/entities';
import { AlertPreferenceType } from '@app/common/enums';
import { Column, Entity } from 'typeorm';

@Entity()
export class TeacherPreference extends BaseEntity {
  /**
   * 주소
   */
  @Column({ type: 'text' })
  address: string;

  /**
   * 선호 지역 (서울, 수원 등)
   */
  @Column({ type: 'json', default: [] })
  preferredRegions: string[];

  /**
   * 선호 지하철역
   */
  @Column({ type: 'json', default: [] })
  preferredSubwayStations: string[];

  /**
   * 선호 알림 타입
   */
  @Column({ type: 'enum', enum: AlertPreferenceType })
  alertPreferenceType: AlertPreferenceType;

  /**
   * 최대 이동 거리 (km)
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 })
  maxDistance: number;
}
