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
exports.AiExtractionService = void 0;
const common_1 = require("@nestjs/common");
const groq_provider_1 = require("./providers/groq.provider");
const EXTRACTION_PROMPT = (rawText) => `You are extracting structured fields from a
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
let AiExtractionService = class AiExtractionService {
    constructor(groq) {
        this.groq = groq;
    }
    async extractProfile(rawText) {
        const raw = await this.groq.complete(EXTRACTION_PROMPT(rawText));
        const parsed = this.parseJson(raw);
        return this.normalize(parsed, rawText);
    }
    parseJson(raw) {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        try {
            return JSON.parse(cleaned);
        }
        catch {
            throw new common_1.BadRequestException('Could not read the AI response as structured data — please fill the form manually.');
        }
    }
    // Defensive normalization: the model mostly follows instructions, but a
    // form pre-filled with a bad enum value or a stringified number is a worse
    // UX than just leaving that one field blank for the matchmaker to fill in.
    normalize(data, rawText) {
        const gender = data.gender === 'MALE' || data.gender === 'FEMALE' ? data.gender : undefined;
        const toNumberOrUndefined = (v) => {
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
};
exports.AiExtractionService = AiExtractionService;
exports.AiExtractionService = AiExtractionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [groq_provider_1.GroqProvider])
], AiExtractionService);
