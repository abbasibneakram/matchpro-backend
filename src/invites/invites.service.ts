import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitInviteProfileDto } from './dto/submit-invite-profile.dto';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async createInvite(matchmakerId: string) {
    const token = randomBytes(24).toString('hex');
    await this.prisma.profileInvite.create({ data: { token, matchmakerId } });
    return { token };
  }

  // Used by the public page on load, before showing the form — lets the
  // frontend distinguish "bad link" from "already used" from "good to go"
  // without needing to submit anything first.
  async validateInvite(token: string) {
    const invite = await this.findInviteOrThrow(token);
    return { valid: !invite.used };
  }

  async submitProfile(token: string, dto: SubmitInviteProfileDto) {
    const invite = await this.findInviteOrThrow(token);
    if (invite.used) {
      throw new GoneException('This invite link has already been used.');
    }

    const profile = await this.prisma.$transaction(async (tx) => {
      const created = await tx.profile.create({
        data: { ...dto, matchmakerId: invite.matchmakerId, status: 'PENDING_REVIEW' },
      });
      await tx.profileInvite.update({ where: { token }, data: { used: true } });
      return created;
    });

    // Public caller only needs confirmation, not the internal profile record.
    return { submitted: true, profileId: profile.id };
  }

  private async findInviteOrThrow(token: string) {
    const invite = await this.prisma.profileInvite.findUnique({ where: { token } });
    if (!invite) throw new NotFoundException('Invite link not found.');
    return invite;
  }
}
