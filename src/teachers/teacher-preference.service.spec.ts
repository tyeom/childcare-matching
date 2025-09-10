import { Test, TestingModule } from '@nestjs/testing';
import { TeacherPreferenceService } from './teacher-preference.service';

describe('TeacherPreferenceService', () => {
  let service: TeacherPreferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherPreferenceService],
    }).compile();

    service = module.get<TeacherPreferenceService>(TeacherPreferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
