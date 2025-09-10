import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'CreatedAt' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  createdBy: User;

  @UpdateDateColumn({ type: 'timestamptz', name: 'ModifiedAt' })
  modifiedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  modifiedBy: User;

  @VersionColumn()
  version: number;
}
