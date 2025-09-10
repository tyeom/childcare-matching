import { ApiExtraModels, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateJobPostDto } from './create-Job-post.dto';
import { IsOptional } from 'class-validator';
import { JobStatus } from '@app/common/enums';
import { IsEnum } from 'class-validator';

@ApiExtraModels(CreateJobPostDto)
export class UpdateJobPostDto extends PartialType(CreateJobPostDto) {
  @ApiProperty({ description: '공고 상태', enum: JobStatus, required: false })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
