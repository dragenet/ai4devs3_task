import type OpenAI from 'openai';
import { ZodError } from 'zod';

import { defaultOpenAICompletionModelConfig } from '../constants/defaultOpenAIModelsConfig';
import { summarizePrompt } from '../prompts/summarize.prompt';
import { mapTranscriptions } from '../utils/mapTranscriptions';
import { type SummarizeResponse, summarizeResponseSchema } from '../validation/summary.validation';
import type { OpenAIService } from './openai.service';

export class SummarizeService {
  constructor(private readonly openAIService: OpenAIService) {}

  async summarize(transcriptions: string[], keywords?: string[]): Promise<SummarizeResponse> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: summarizePrompt(keywords),
      },
      {
        role: 'user',
        content: mapTranscriptions(transcriptions),
      },
    ];

    const response = await this.openAIService.complete(
      messages,
      { json: true },
      {
        ...defaultOpenAICompletionModelConfig,
        temperature: 1,
      },
    );

    try {
      return summarizeResponseSchema.parse(JSON.parse(response));
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
