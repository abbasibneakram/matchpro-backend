import { BadRequestException, Injectable } from '@nestjs/common';
import { GroqProvider } from './providers/groq.provider';

const EXTRACTION_PROMPT = (rawText: string) => `You are extracting structured fields from a
matrimonial/matchmaking profile description. Read the text and return ONLY a JSON object
(no markdown code fences, no commentary) with exactly these keys:

name (string), age (number), gender ("MALE" or "FEMALE"), education (string or null),
profession (string or null), city (string or null), religion (string or null),
sect (string or null), caste (string or null), familyDetails (string or null),
prefAgeMin (number or null), prefAgeMax (number or null), prefEducation (string or null),
prefCity (string or null), prefReligion (string or null), prefSect (string or null),
prefCaste (string or null)

Rules:
- Use null for anything not mentioned in the text — never guess or invent values.
- gender must be exactly "MALE" or "FEMALE", inferred from context/name/pronouns.
- age and prefAgeMin/prefAgeMax must be plain numbers, not strings.

Text to extract from:
"""
${rawText}
"""`;

@Injectable()
export class AiExtractionService {
  constructor(private groq: GroqProvider) {}

  async extractProfile(rawText: string) {
    const raw = await this.groq.complete(EXTRACTION_PROMPT(rawText));
    const parsed = this.parseJson(raw);
    return this.normalize(parsed, rawText);
  }

  private parseJson(raw: string): Record<string, any> {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new BadRequestException(
        'Could not read the AI response as structured data — please fill the form manually.',
      );
    }
  }

  // Defensive normalization: the model mostly follows instructions, but a
  // form pre-filled with a bad enum value or a stringified number is a worse
  // UX than just leaving that one field blank for the matchmaker to fill in.
  private normalize(data: Record<string, any>, rawText: string) {
    const gender = data.gender === 'MALE' || data.gender === 'FEMALE' ? data.gender : undefined;
    const toNumberOrUndefined = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    return {
      gender,
      name: typeof data.name === 'string' ? data.name : '',
      age: toNumberOrUndefined(data.age),
      education: data.education ?? undefined,
      profession: data.profession ?? undefined,
      city: data.city ?? undefined,
      religion: data.religion ?? undefined,
      sect: data.sect ?? undefined,
      caste: data.caste ?? undefined,
      familyDetails: data.familyDetails ?? undefined,
      prefAgeMin: toNumberOrUndefined(data.prefAgeMin),
      prefAgeMax: toNumberOrUndefined(data.prefAgeMax),
      prefEducation: data.prefEducation ?? undefined,
      prefCity: data.prefCity ?? undefined,
      prefReligion: data.prefReligion ?? undefined,
      prefSect: data.prefSect ?? undefined,
      prefCaste: data.prefCaste ?? undefined,
      rawPastedText: rawText,
    };
  }
}
