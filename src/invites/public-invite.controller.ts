import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { SubmitInviteProfileDto } from './dto/submit-invite-profile.dto';

// No JwtAuthGuard anywhere in this controller — deliberately public.
// The token itself is the access boundary: possessing a valid, unused
// token is what authorizes filling in that one profile, once.
@Controller('public/invite')
export class PublicInviteController {
  constructor(private invitesService: InvitesService) {}

  @Get(':token')
  check(@Param('token') token: string) {
    return this.invitesService.validateInvite(token);
  }

  @Post(':token')
  submit(@Param('token') token: string, @Body() dto: SubmitInviteProfileDto) {
    return this.invitesService.submitProfile(token, dto);
  }
}
