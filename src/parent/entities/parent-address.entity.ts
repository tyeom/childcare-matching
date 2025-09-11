import { Entity, Column, ManyToOne } from 'typeorm';
import { JobPost } from './job-post.entity';
import { BaseEntity } from '@app/common/base/entities';

@Entity()
export class ParentAddress extends BaseEntity {
  /**
   * 상세 주소
   */
  @Column({ type: 'text', name: 'detailed_address' })
  detailedAddress: string;

  /**
   * 구/군/시
   */
  @Column({ length: 50, name: 'district' })
  district: string;

  /**
   * 시/도
   */
  @Column({ length: 50, name: 'city_province' })
  cityProvince: string;

  /**
   * 주소 타입
   */
  @Column({ length: 20, default: 'PRIMARY' })
  addressType: string;

  /**
   * 공고
   */
  @ManyToOne(() => JobPost, (jobPost) => jobPost.addresses, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  jobPost: JobPost;
}
