import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMatchmaker } from '../common/decorators/current-matchmaker.decorator';
import { MatchingService } from './matching.service';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Get(':id/matches')
  findMatches(@CurrentMatchmaker() mm: { id: string }, @Param('id') id: string) {
    return this.matchingService.findMatches(mm.id, id);
  }
}
