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
exports.MatchingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const profiles_service_1 = require("../profiles/profiles.service");
const MAX_RESULTS = 50;
let MatchingService = class MatchingService {
    constructor(prisma, profilesService) {
        this.prisma = prisma;
        this.profilesService = profilesService;
    }
    async findMatches(matchmakerId, profileId) {
        // findOne already throws NotFound/Forbidden if this profile isn't the
        // caller's — reused here so matching gets the same ownership guarantee
        // as every other module for free.
        const source = await this.profilesService.findOne(matchmakerId, profileId);
        const candidates = await this.prisma.profile.findMany({
            where: {
                matchmakerId, // MVP: matching only within the matchmaker's own pool
                status: 'ACTIVE',
                gender: source.gender === 'MALE' ? 'FEMALE' : 'MALE',
                id: { not: source.id },
            },
        });
        // Pull any matches already acted on for this source profile, so the
        // list can show "already shared / Interested" instead of recomputing
        // from scratch every time and losing that state.
        const existing = await this.prisma.match.findMany({
            where: { sourceProfileId: profileId, targetProfileId: { in: candidates.map((c) => c.id) } },
        });
        const existingByTarget = new Map(existing.map((m) => [m.targetProfileId, m]));
        return candidates
            .map((candidate) => {
            const match = existingByTarget.get(candidate.id);
            return {
                profile: candidate,
                score: this.score(source, candidate),
                matchId: match?.id ?? null,
                status: match?.status ?? null,
                sharedAt: match?.sharedAt ?? null,
            };
        })
            .filter((m) => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_RESULTS);
    }
    async share(matchmakerId, sourceProfileId, targetProfileId) {
        // Both profiles must belong to the caller — a matchmaker could otherwise
        // probe someone else's profile IDs by trying to "share" against them.
        const source = await this.profilesService.findOne(matchmakerId, sourceProfileId);
        const target = await this.profilesService.findOne(matchmakerId, targetProfileId);
        const score = this.score(source, target);
        const match = await this.prisma.match.upsert({
            where: { sourceProfileId_targetProfileId: { sourceProfileId, targetProfileId } },
            create: { sourceProfileId, targetProfileId, score, sharedAt: new Date() },
            update: { sharedAt: new Date(), score },
        });
        return {
            matchId: match.id,
            status: match.status,
            shareText: this.buildShareText(target),
            shareUrl: `https://wa.me/?text=${encodeURIComponent(this.buildShareText(target))}`,
        };
    }
    async updateStatus(matchmakerId, matchId, status) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { sourceProfile: true },
        });
        if (!match)
            throw new common_1.NotFoundException('Match not found');
        if (match.sourceProfile.matchmakerId !== matchmakerId) {
            throw new common_1.ForbiddenException('You do not have access to this match');
        }
        return this.prisma.match.update({ where: { id: matchId }, data: { status } });
    }
    // Deliberately no photos and no direct contact info here — this is a
    // teaser sent over WhatsApp, matching the product's "no photos in blind
    // shares" confidentiality stance. Full details stay inside MatchPro.
    buildShareText(profile) {
        const lines = [
            `New match suggestion: ${profile.name}, ${profile.age} yrs`,
            profile.city ? `Location: ${profile.city}` : null,
            profile.education ? `Education: ${profile.education}` : null,
            profile.profession ? `Profession: ${profile.profession}` : null,
            `Shared via MatchPro`,
        ].filter(Boolean);
        return lines.join('\n');
    }
    // Rule-based two-way scoring: every criterion is checked in both
    // directions (does A fit B's preferences AND does B fit A's) since a
    // real match requires mutual fit, not just one side's wishlist.
    // Weights are a starting point — tune once real outcome data exists.
    score(a, b) {
        let points = 0;
        let total = 0;
        total += 15;
        if (this.ageInRange(b.age, a.prefAgeMin, a.prefAgeMax))
            points += 15;
        total += 15;
        if (this.ageInRange(a.age, b.prefAgeMin, b.prefAgeMax))
            points += 15;
        total += 10;
        if (this.fits(a.prefCity, b.city))
            points += 10;
        total += 10;
        if (this.fits(b.prefCity, a.city))
            points += 10;
        total += 10;
        if (this.fits(a.prefReligion, b.religion))
            points += 10;
        total += 10;
        if (this.fits(b.prefReligion, a.religion))
            points += 10;
        total += 5;
        if (this.fits(a.prefSect, b.sect))
            points += 5;
        total += 5;
        if (this.fits(b.prefSect, a.sect))
            points += 5;
        total += 5;
        if (this.fits(a.prefCaste, b.caste))
            points += 5;
        total += 5;
        if (this.fits(b.prefCaste, a.caste))
            points += 5;
        total += 5;
        if (this.fits(a.prefEducation, b.education))
            points += 5;
        total += 5;
        if (this.fits(b.prefEducation, a.education))
            points += 5;
        return total === 0 ? 0 : Math.round((points / total) * 100);
    }
    // A preference that's unset counts as "no constraint", so it doesn't
    // penalize a candidate who never stated a preference on that field.
    fits(preference, actual) {
        if (!preference)
            return true;
        return preference.toLowerCase() === (actual ?? '').toLowerCase();
    }
    ageInRange(age, min, max) {
        if (!min && !max)
            return true;
        return (!min || age >= min) && (!max || age <= max);
    }
};
exports.MatchingService = MatchingService;
exports.MatchingService = MatchingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        profiles_service_1.ProfilesService])
], MatchingService);
