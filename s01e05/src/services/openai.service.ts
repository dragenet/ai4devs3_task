import OpenAI from 'openai';

import { defaultOpenAIModelConfig } from '../constants/defaultOpenAIModelConfig';
import type { OpenAIModelConfig, OpenAIModelOptions } from '../types/ModelConfig';

export class OpenAIService {
  constructor(private openai: OpenAI, private readonly systemPrompt: string) {}

  async complete(
    query: string,
    modelOptions?: OpenAIModelOptions,
    modelConfig: OpenAIModelConfig = defaultOpenAIModelConfig,
  ) {
    const chatCompletion = await this.openai.chat.completions.create({
      ...modelConfig,
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      response_format: modelOptions?.json
        ? modelOptions?.jsonSchema
          ? { type: 'json_schema', json_schema: modelOptions.jsonSchema }
          : { type: 'json_object' }
        : { type: 'text' },
    });

    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    return content;
  }
}
