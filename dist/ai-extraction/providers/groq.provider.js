"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqProvider = void 0;
const common_1 = require("@nestjs/common");
// Groq's free tier — fast enough that extraction feels close to instant in the UI.
// Swap this out (e.g. for a GeminiProvider) without touching anything else
// in the ai-extraction module, since AiExtractionService only depends on
// the `complete(prompt): Promise<string>` shape.
let GroqProvider = class GroqProvider {
    async complete(prompt) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new common_1.InternalServerErrorException('GROQ_API_KEY is not set — add it to backend/.env (see .env.example).');
        }
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
            }),
        });
        if (!res.ok) {
            const errBody = await res.text().catch(() => '');
            throw new common_1.InternalServerErrorException(`Groq API error (${res.status}): ${errBody}`);
        }
        const data = await res.json();
        return data.choices[0].message.content;
    }
};
exports.GroqProvider = GroqProvider;
exports.GroqProvider = GroqProvider = __decorate([
    (0, common_1.Injectable)()
], GroqProvider);
