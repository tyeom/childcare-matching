import { Test, TestingModule } from '@nestjs/testing';
import { TeacherPreferenceController } from './teacher-preference.controller';
import { TeacherPreferenceService } from './teacher-preference.service';

describe('TeacherPreferenceController', () => {
  let controller: TeacherPreferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherPreferenceController],
      providers: [TeacherPreferenceService],
    }).compile();

    controller = module.get<TeacherPreferenceController>(
      TeacherPreferenceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
