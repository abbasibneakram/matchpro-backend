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
exports.InvitesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let InvitesService = class InvitesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInvite(matchmakerId) {
        const token = (0, crypto_1.randomBytes)(24).toString('hex');
        await this.prisma.profileInvite.create({ data: { token, matchmakerId } });
        return { token };
    }
    // Used by the public page on load, before showing the form — lets the
    // frontend distinguish "bad link" from "already used" from "good to go"
    // without needing to submit anything first.
    async validateInvite(token) {
        const invite = await this.findInviteOrThrow(token);
        return { valid: !invite.used };
    }
    async submitProfile(token, dto) {
        const invite = await this.findInviteOrThrow(token);
        if (invite.used) {
            throw new common_1.GoneException('This invite link has already been used.');
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
    async findInviteOrThrow(token) {
        const invite = await this.prisma.profileInvite.findUnique({ where: { token } });
        if (!invite)
            throw new common_1.NotFoundException('Invite link not found.');
        return invite;
    }
};
exports.InvitesService = InvitesService;
exports.InvitesService = InvitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitesService);
