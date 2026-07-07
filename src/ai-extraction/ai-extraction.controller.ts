import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiExtractionService } from './ai-extraction.service';
import { ExtractProfileDto } from './dto/extract-profile.dto';

// Deliberately routed under /profiles (not /ai-extraction) since this is
// conceptually "step one of creating a profile", not a separate resource.
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class AiExtractionController {
  constructor(private aiExtractionService: AiExtractionService) {}

  @Post('extract')
  extract(@Body() dto: ExtractProfileDto) {
    return this.aiExtractionService.extractProfile(dto.rawText);
  }
}
