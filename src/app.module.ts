import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AiExtractionModule } from './ai-extraction/ai-extraction.module';
import { InvitesModule } from './invites/invites.module';
import { PhotosModule } from './photos/photos.module';
import { MatchingModule } from './matching/matching.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProfilesModule,
    AiExtractionModule,
    InvitesModule,
    PhotosModule,
    MatchingModule
  ],
  controllers: [AppController],
})
export class AppModule {}
