import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { StorageProvider } from './storage.provider';

@Injectable()
export class PhotosService {
  constructor(
    private prisma: PrismaService,
    private profilesService: ProfilesService,
    private storage: StorageProvider,
  ) {}

  async upload(matchmakerId: string, profileId: string, file: Express.Multer.File) {
    await this.profilesService.findOne(matchmakerId, profileId); // throws if not owned

    const key = `profiles/${profileId}/${randomUUID()}-${file.originalname}`;
    await this.storage.upload(key, file.buffer, file.mimetype);

    const photo = await this.prisma.photo.create({ data: { profileId, storageKey: key } });
    return { id: photo.id, url: await this.storage.getSignedGetUrl(key) };
  }

  async list(matchmakerId: string, profileId: string) {
    await this.profilesService.findOne(matchmakerId, profileId);

    const photos = await this.prisma.photo.findMany({
      where: { profileId },
      orderBy: { createdAt: 'asc' },
    });

    // Signed fresh on every request rather than cached — keeps URLs short-lived
    // even if a matchmaker leaves the gallery open for a while.
    return Promise.all(
      photos.map(async (p) => ({ id: p.id, url: await this.storage.getSignedGetUrl(p.storageKey) })),
    );
  }

  async remove(matchmakerId: string, profileId: string, photoId: string) {
    await this.profilesService.findOne(matchmakerId, profileId);

    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo || photo.profileId !== profileId) {
      throw new NotFoundException('Photo not found');
    }

    await this.storage.delete(photo.storageKey);
    await this.prisma.photo.delete({ where: { id: photoId } });
    return { deleted: true };
  }
}
