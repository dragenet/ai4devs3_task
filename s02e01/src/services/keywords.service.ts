import type OpenAI from 'openai';
import { ZodError } from 'zod';

import { defaultOpenAICompletionModelConfig } from '../constants/defaultOpenAIModelsConfig';
import { keywordsPrompt } from '../prompts/keywords.prompt';
import { type KeywordsResponse, keywordsResponseSchema } from '../validation/keywords.validation';
import type { OpenAIService } from './openai.service';

export class KeywordsService {
  constructor(private readonly openAIService: OpenAIService) {}

  async extractKeywords(question: string): Promise<KeywordsResponse> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: keywordsPrompt,
      },
      {
        role: 'user',
        content: question,
      },
    ];

    const response = await this.openAIService.complete(
      messages,
      { json: true },
      {
        model: 'gpt-4o-mini',
        temperature: 1,
      },
    );

    try {
      return keywordsResponseSchema.parse(JSON.parse(response));
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Invalid response format: ${error.message}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON response from OpenAI');
      }
      throw error;
    }
  }
}
