import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ParentModule } from 'src/parent/parent.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, ParentModule, TeachersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
