import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

export enum ProfileStatusDto {
  PENDING_REVIEW = 'PENDING_REVIEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// PartialType makes every CreateProfileDto field optional for edits,
// plus status which only makes sense on update (e.g. activating a profile).
export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @IsOptional()
  @IsEnum(ProfileStatusDto)
  status?: ProfileStatusDto;
}
