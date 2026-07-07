import {
  BadRequestException, Controller, Delete, Get, Param, Post, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMatchmaker } from '../common/decorators/current-matchmaker.decorator';
import { PhotosService } from './photos.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

@UseGuards(JwtAuthGuard)
@Controller('profiles/:profileId/photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(), // buffer only, never written to local disk
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new BadRequestException('Only JPEG, PNG, or WEBP images are allowed'), false);
      }
      cb(null, true);
    },
  }))
  upload(
    @CurrentMatchmaker() mm: { id: string },
    @Param('profileId') profileId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.photosService.upload(mm.id, profileId, file);
  }

  @Get()
  list(@CurrentMatchmaker() mm: { id: string }, @Param('profileId') profileId: string) {
    return this.photosService.list(mm.id, profileId);
  }

  @Delete(':photoId')
  remove(
    @CurrentMatchmaker() mm: { id: string },
    @Param('profileId') profileId: string,
    @Param('photoId') photoId: string,
  ) {
    return this.photosService.remove(mm.id, profileId, photoId);
  }
}
