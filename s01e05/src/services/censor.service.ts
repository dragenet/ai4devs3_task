import { OpenAI } from 'openai';
import { z } from 'zod';

import { OpenAIService } from './openai.service';

const modelResponseSchema = z.object({
  _thoughts: z.string(),
  result: z.string(),
});

export class CensorService {
  private readonly openaiService: OpenAIService;

  constructor(private readonly openai: OpenAI, private readonly systemPrompt: string) {
    this.openaiService = new OpenAIService(openai, systemPrompt);
  }

  async censor(text: string) {
    return this.toJSON(await this.openaiService.complete(text));
  }

  private toJSON(text: string) {
    return this.validate(JSON.parse(text));
  }

  private validate(json: unknown) {
    return modelResponseSchema.parse(json);
  }
}
