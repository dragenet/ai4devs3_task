import type OpenAI from 'openai';
import { ZodError } from 'zod';

import { defaultOpenAICompletionModelConfig } from '../constants/defaultOpenAIModelsConfig';
import { answerPrompt } from '../prompts/answer.prompt';
import { type AnswerResponse, answerResponseSchema } from '../validation/answer.validation';
import type { OpenAIService } from './openai.service';

export class AnswerService {
  constructor(private readonly openAIService: OpenAIService) {}

  async answer(question: string, context: string): Promise<AnswerResponse> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: answerPrompt(context),
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
        ...defaultOpenAICompletionModelConfig,
        temperature: 0.7,
      },
    );

    try {
      const responseJson = answerResponseSchema.parse(JSON.parse(response));

      return responseJson;
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
