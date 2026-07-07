import { Module } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { StorageProvider } from './storage.provider';

@Module({
  imports: [ProfilesModule], // for the exported ProfilesService ownership check
  controllers: [PhotosController],
  providers: [PhotosService, StorageProvider],
})
export class PhotosModule {}
