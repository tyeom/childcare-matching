import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ParentAddress } from './parent-address.entity';
import { BaseEntity } from '@app/common/base/entities';
import { User } from 'src/users/entities/user.entity';
import { JobStatus, StudentLevel } from '../../../libs/common/src/enums/index';

@Entity()
export class JobPost extends BaseEntity {
  @OneToMany(() => ParentAddress, (parentAddress) => parentAddress.jobPost, {
    cascade: true,
    // 주소도 함께 조회
    eager: true,
  })
  addresses: ParentAddress[];

  /**
   * 공고 상세 정보
   */
  @Column({ type: 'text', name: 'job_details' })
  jobDetails: string;

  /**
   * 공고 제목
   */
  @Column({ length: 100 })
  title: string;

  /**
   * 학생 레벨
   */
  @Column({ type: 'enum', enum: StudentLevel })
  studentLevel: StudentLevel;

  /**
   * 수업 시간 (분)
   */
  @Column({ type: 'int' })
  sessionDuration: number;

  /**
   * 선호 요일 ['월', '화', '수']
   */
  @Column({ type: 'json', default: [] })
  preferredDays: string[];

  /**
   * 선호 시작 시간
   */
  @Column({ type: 'time', nullable: true })
  preferredStartTime: string;

  /**
   * 요구사항
   */
  @Column({ type: 'text', nullable: true })
  requirements: string;

  /**
   * 공고 상태
   */
  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.ACTIVE })
  status: JobStatus;

  /**
   * 매칭된 선생님 정보
   */
  @ManyToOne(() => User, (user) => user.id)
  matchedTeacher: User;

  /**
   * 매칭된 시간
   */
  @Column({ type: 'timestamp', nullable: true })
  matchedAt: Date;
}
