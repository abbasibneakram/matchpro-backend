import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMatchmaker } from '../common/decorators/current-matchmaker.decorator';
import { MatchingService } from './matching.service';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';

// Separate controller from MatchingController because this operates on a
// persisted Match by its own id (/matches/:id), not nested under /profiles.
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private matchingService: MatchingService) {}

  @Patch(':id/status')
  updateStatus(
    @CurrentMatchmaker() mm: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateMatchStatusDto,
  ) {
    return this.matchingService.updateStatus(mm.id, id, dto.status);
  }
}
