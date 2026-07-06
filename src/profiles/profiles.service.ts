import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  create(matchmakerId: string, dto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: { ...dto, matchmakerId },
    });
  }

  findAll(matchmakerId: string, status?: string) {
    return this.prisma.profile.findMany({
      where: { matchmakerId, ...(status ? { status: status as any } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(matchmakerId: string, id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    // Ownership check — this is the tenant-isolation boundary. Never trust
    // the :id param alone; always confirm it belongs to the caller.
    if (profile.matchmakerId !== matchmakerId) {
      throw new ForbiddenException('You do not have access to this profile');
    }
    return profile;
  }

  async update(matchmakerId: string, id: string, dto: UpdateProfileDto) {
    await this.findOne(matchmakerId, id); // throws if not owned
    return this.prisma.profile.update({ where: { id }, data: dto });
  }
}
