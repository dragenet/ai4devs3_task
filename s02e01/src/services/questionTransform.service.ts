import type OpenAI from 'openai';
import { ZodError } from 'zod';

import { defaultOpenAICompletionModelConfig } from '../constants/defaultOpenAIModelsConfig';
import { questionTransformPrompt } from '../prompts/questionTransform.prompt';
import {
  type QuestionTransformResponse,
  questionTransformResponseSchema,
} from '../validation/questionTransform.validation';
import type { OpenAIService } from './openai.service';

export class QuestionTransformService {
  constructor(private readonly openAIService: OpenAIService) {}

  async transform(question: string, context: string): Promise<QuestionTransformResponse> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: questionTransformPrompt(context),
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
      const responseJson = questionTransformResponseSchema.parse(JSON.parse(response));

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
