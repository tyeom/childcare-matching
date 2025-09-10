import { Module } from '@nestjs/common';
import { TeacherPreferenceService } from './teacher-preference.service';
import { TeacherPreferenceController } from './teacher-preference.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherPreference } from './entities/teacher-preference.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherPreference]), UsersModule],
  controllers: [TeacherPreferenceController],
  providers: [TeacherPreferenceService],
})
export class TeachersModule {}
