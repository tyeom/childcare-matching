import { ApiExtraModels, PartialType } from '@nestjs/swagger';
import { CreateTeacherPreferenceDto } from './create-teacher-preference.dto';

@ApiExtraModels(CreateTeacherPreferenceDto)
export class UpdateTeacherPreferenceDto extends PartialType(
  CreateTeacherPreferenceDto,
) {}
