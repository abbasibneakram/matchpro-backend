import { Module } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

@Module({
  imports: [ProfilesModule], // for the exported ProfilesService ownership check
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}
