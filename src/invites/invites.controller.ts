import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMatchmaker } from '../common/decorators/current-matchmaker.decorator';
import { InvitesService } from './invites.service';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Post('invite')
  create(@CurrentMatchmaker() mm: { id: string }) {
    return this.invitesService.createInvite(mm.id); // { token } — frontend builds the shareable URL
  }
}
