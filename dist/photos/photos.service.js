"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotosService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const profiles_service_1 = require("../profiles/profiles.service");
const storage_provider_1 = require("./storage.provider");
let PhotosService = class PhotosService {
    constructor(prisma, profilesService, storage) {
        this.prisma = prisma;
        this.profilesService = profilesService;
        this.storage = storage;
    }
    async upload(matchmakerId, profileId, file) {
        await this.profilesService.findOne(matchmakerId, profileId); // throws if not owned
        const key = `profiles/${profileId}/${(0, crypto_1.randomUUID)()}-${file.originalname}`;
        await this.storage.upload(key, file.buffer, file.mimetype);
        const photo = await this.prisma.photo.create({ data: { profileId, storageKey: key } });
        return { id: photo.id, url: await this.storage.getSignedGetUrl(key) };
    }
    async list(matchmakerId, profileId) {
        await this.profilesService.findOne(matchmakerId, profileId);
        const photos = await this.prisma.photo.findMany({
            where: { profileId },
            orderBy: { createdAt: 'asc' },
        });
        // Signed fresh on every request rather than cached — keeps URLs short-lived
        // even if a matchmaker leaves the gallery open for a while.
        return Promise.all(photos.map(async (p) => ({ id: p.id, url: await this.storage.getSignedGetUrl(p.storageKey) })));
    }
    async remove(matchmakerId, profileId, photoId) {
        await this.profilesService.findOne(matchmakerId, profileId);
        const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
        if (!photo || photo.profileId !== profileId) {
            throw new common_1.NotFoundException('Photo not found');
        }
        await this.storage.delete(photo.storageKey);
        await this.prisma.photo.delete({ where: { id: photoId } });
        return { deleted: true };
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        profiles_service_1.ProfilesService,
        storage_provider_1.StorageProvider])
], PhotosService);
