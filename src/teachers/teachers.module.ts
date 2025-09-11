import { Module } from '@nestjs/common';
import { TeacherPreferenceService } from './teacher-preference.service';
import { TeacherPreferenceController } from './teacher-preference.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherPreference } from './entities/teacher-preference.entity';
import { UsersModule } from 'src/users/users.module';
import { localSearchAddressProvider } from './providers/local-search-address.provider';
import { HttpModule } from '@nestjs/axios';
import { SearchMetroLatLngProvider } from './providers/search-metro-lat-lng.provider';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TeacherPreference]),
    UsersModule,
  ],
  controllers: [TeacherPreferenceController],
  providers: [
    TeacherPreferenceService,
    localSearchAddressProvider,
    SearchMetroLatLngProvider,
  ],
  exports: [TeacherPreferenceService],
})
export class TeachersModule {}
