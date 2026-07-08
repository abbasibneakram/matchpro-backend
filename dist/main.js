"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Falls back to allowing all origins if FRONTEND_URL isn't set (local dev
    // convenience) — set it in production so only your actual frontend can call this API.
    app.enableCors({ origin: process.env.FRONTEND_URL || true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
