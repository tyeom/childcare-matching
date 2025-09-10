import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Role } from '../../../libs/common/src/enums/index';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column({ length: 250 })
  userName: string;

  @Column({ length: 200 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Exclude()
  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'user_role_enum',
    nullable: false,
  })
  role: Role;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  modifiedAt: Date;

  @VersionColumn()
  version: number;
}
