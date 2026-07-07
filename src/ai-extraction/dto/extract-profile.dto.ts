import { IsString, MinLength } from 'class-validator';

export class ExtractProfileDto {
  @IsString()
  @MinLength(20, { message: 'Pasted text is too short to extract anything useful from.' })
  rawText: string;
}
