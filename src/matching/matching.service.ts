import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';

const MAX_RESULTS = 50;

@Injectable()
export class MatchingService {
  constructor(
    private prisma: PrismaService,
    private profilesService: ProfilesService,
  ) {}

  async findMatches(matchmakerId: string, profileId: string) {
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
  private score(a: any, b: any): number {
    let points = 0;
    let total = 0;

    total += 15; if (this.ageInRange(b.age, a.prefAgeMin, a.prefAgeMax)) points += 15;
    total += 15; if (this.ageInRange(a.age, b.prefAgeMin, b.prefAgeMax)) points += 15;

    total += 10; if (this.fits(a.prefCity, b.city)) points += 10;
    total += 10; if (this.fits(b.prefCity, a.city)) points += 10;

    total += 10; if (this.fits(a.prefReligion, b.religion)) points += 10;
    total += 10; if (this.fits(b.prefReligion, a.religion)) points += 10;

    total += 5; if (this.fits(a.prefSect, b.sect)) points += 5;
    total += 5; if (this.fits(b.prefSect, a.sect)) points += 5;

    total += 5; if (this.fits(a.prefCaste, b.caste)) points += 5;
    total += 5; if (this.fits(b.prefCaste, a.caste)) points += 5;

    total += 5; if (this.fits(a.prefEducation, b.education)) points += 5;
    total += 5; if (this.fits(b.prefEducation, a.education)) points += 5;

    return total === 0 ? 0 : Math.round((points / total) * 100);
  }

  // A preference that's unset counts as "no constraint", so it doesn't
  // penalize a candidate who never stated a preference on that field.
  private fits(preference: string | null | undefined, actual: string | null | undefined): boolean {
    if (!preference) return true;
    return preference.toLowerCase() === (actual ?? '').toLowerCase();
  }

  private ageInRange(age: number, min: number | null | undefined, max: number | null | undefined): boolean {
    if (!min && !max) return true;
    return (!min || age >= min) && (!max || age <= max);
  }
}
