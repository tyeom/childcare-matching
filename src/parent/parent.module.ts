import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { JobPost } from './entities/job-post.entity';
import { ParentAddress } from './entities/parent-address.entity';
import { TeachersModule } from 'src/teachers/teachers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost, ParentAddress]),
    UsersModule,
    TeachersModule,
  ],
  controllers: [JobPostController, JobPostController],
  providers: [JobPostService],
  exports: [JobPostService],
})
export class ParentModule {}
