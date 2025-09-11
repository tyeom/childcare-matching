import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { APP_FILTER } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';
import { RBACGuard } from '@app/common/guard';
import { AllExceptionsFilter } from '@app/common/filter/all-exception.filter';
import { TeachersModule } from './teachers/teachers.module';
import { TeacherPreference } from './teachers/entities/teacher-preference.entity';
import { JwtAuthGuard } from './auth/strategy/jwt.strategy';
import { ParentModule } from './parent/parent.module';
import { ParentAddress } from './parent/entities/parent-address.entity';
import { JobPost } from './parent/entities/job-post.entity';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('production')
          .required(),
        DB_TYPE: Joi.string().valid('postgres').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        MATCHING_SUBWAY_STATIONS_NAX_DISTANCE: Joi.number()
          .default(1)
          .required(),
        KAKAO_API_URL: Joi.string().required(),
        KAKAO_API: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE') as 'postgres',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT') || '5432'),
          username: configService.get('DB_USERNAME') || '',
          password: configService.get('DB_PASSWORD') || '',
          database: configService.get<string>('DB_DATABASE') || '',
          entities: [User, TeacherPreference, JobPost, ParentAddress],
          logging: process.env.NODE_ENV === 'development' ? true : false,
          logger: 'advanced-console',
          synchronize: process.env.NODE_ENV === 'development' ? true : false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TeachersModule,
    ParentModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
