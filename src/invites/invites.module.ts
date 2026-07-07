import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { PublicInviteController } from './public-invite.controller';
import { InvitesService } from './invites.service';

@Module({
  controllers: [InvitesController, PublicInviteController],
  providers: [InvitesService],
})
export class InvitesModule {}
