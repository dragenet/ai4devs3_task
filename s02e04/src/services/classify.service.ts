import { OpenAIService } from 'common/services/openai';
import { zodToJsonSchema } from 'openai/_vendor/zod-to-json-schema/zodToJsonSchema.mjs';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { classifyPrompt } from '../prompts/classify.prompt';
import { classifyResponseSchema } from '../validation/classifyResponse.validation';

export class ClassifyService {
  constructor(private readonly openAIService: OpenAIService) {}

  async classify(report: string) {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: classifyPrompt },
      { role: 'user', content: report },
    ];

    const result = await this.openAIService.complete(messages, {
      json: true,
    });

    return classifyResponseSchema.parse(JSON.parse(result));
  }
}
