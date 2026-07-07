import { Injectable, InternalServerErrorException } from '@nestjs/common';

// Groq's free tier — fast enough that extraction feels close to instant in the UI.
// Swap this out (e.g. for a GeminiProvider) without touching anything else
// in the ai-extraction module, since AiExtractionService only depends on
// the `complete(prompt): Promise<string>` shape.
@Injectable()
export class GroqProvider {
  async complete(prompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'GROQ_API_KEY is not set — add it to backend/.env (see .env.example).',
      );
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
      throw new InternalServerErrorException(`Groq API error (${res.status}): ${errBody}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }
}
