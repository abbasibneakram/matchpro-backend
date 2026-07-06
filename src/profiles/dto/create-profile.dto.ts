import {
  IsEnum, IsInt, IsOptional, IsString, Min, Max,
} from 'class-validator';

export enum GenderDto { MALE = 'MALE', FEMALE = 'FEMALE' }

export class CreateProfileDto {
  @IsEnum(GenderDto)
  gender: GenderDto;

  @IsString()
  name: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() profession?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() religion?: string;
  @IsOptional() @IsString() sect?: string;
  @IsOptional() @IsString() caste?: string;
  @IsOptional() @IsString() familyDetails?: string;
  @IsOptional() @IsString() rawPastedText?: string;

  @IsOptional() @IsInt() @Min(18) prefAgeMin?: number;
  @IsOptional() @IsInt() @Max(100) prefAgeMax?: number;
  @IsOptional() @IsString() prefEducation?: string;
  @IsOptional() @IsString() prefCity?: string;
  @IsOptional() @IsString() prefReligion?: string;
  @IsOptional() @IsString() prefSect?: string;
  @IsOptional() @IsString() prefCaste?: string;
}
