import { IsEnum } from 'class-validator';

export enum MatchStatusDto {
  SUGGESTED = 'SUGGESTED',
  INTERESTED = 'INTERESTED',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  REJECTED = 'REJECTED',
  MARRIED = 'MARRIED',
}

export class UpdateMatchStatusDto {
  @IsEnum(MatchStatusDto)
  status: MatchStatusDto;
}
