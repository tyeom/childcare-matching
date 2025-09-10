import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { JobPost } from './entities/job-post.entity';
import { ParentAddress } from './entities/parent-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, ParentAddress]), UsersModule],
  controllers: [JobPostController, JobPostController],
  providers: [JobPostService],
})
export class ParentModule {}
