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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfilesService = class ProfilesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(matchmakerId, dto) {
        return this.prisma.profile.create({
            data: { ...dto, matchmakerId },
        });
    }
    findAll(matchmakerId, status) {
        return this.prisma.profile.findMany({
            where: { matchmakerId, ...(status ? { status: status } : {}) },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(matchmakerId, id) {
        const profile = await this.prisma.profile.findUnique({ where: { id } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        // Ownership check — this is the tenant-isolation boundary. Never trust
        // the :id param alone; always confirm it belongs to the caller.
        if (profile.matchmakerId !== matchmakerId) {
            throw new common_1.ForbiddenException('You do not have access to this profile');
        }
        return profile;
    }
    async update(matchmakerId, id, dto) {
        await this.findOne(matchmakerId, id); // throws if not owned
        return this.prisma.profile.update({ where: { id }, data: dto });
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesService);
