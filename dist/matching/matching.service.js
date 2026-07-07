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
        return candidates
            .map((candidate) => ({ profile: candidate, score: this.score(source, candidate) }))
            .filter((match) => match.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_RESULTS);
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
