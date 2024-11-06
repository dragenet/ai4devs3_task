import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { modelPrompt } from '../prompts/model.prompt';
import { modelResponseSchema } from '../schemas/model.schema';
import type { ModelResponse } from '../types';

export class OpenAIService {
  private openai: OpenAI;

  constructor(
    apiKey: string,
    private readonly model = 'gpt-4o',
    private readonly temperature = 0.7
  ) {
    this.openai = new OpenAI({ apiKey });
  }

  async complete(message: Record<string, unknown>): Promise<ModelResponse> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: modelPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify(message),
        },
      ],
      temperature: this.temperature,
      response_format: zodResponseFormat(modelResponseSchema, 'modelResponse'),
    });

    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    return modelResponseSchema.parse(JSON.parse(content));
  }
}
