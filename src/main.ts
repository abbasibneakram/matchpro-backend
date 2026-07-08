import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Falls back to allowing all origins if FRONTEND_URL isn't set (local dev
  // convenience) — set it in production so only your actual frontend can call this API.
  app.enableCors({ origin: process.env.FRONTEND_URL || true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
