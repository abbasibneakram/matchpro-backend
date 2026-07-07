import { Module } from '@nestjs/common';
import { AiExtractionController } from './ai-extraction.controller';
import { AiExtractionService } from './ai-extraction.service';
import { GroqProvider } from './providers/groq.provider';

@Module({
  controllers: [AiExtractionController],
  providers: [AiExtractionService, GroqProvider],
})
export class AiExtractionModule {}
