import { observeOpenAI } from 'langfuse';
import OpenAI from 'openai';

import { env } from '../config/env.config';
import type { LangfuseConfig } from '../types/LangfuseConfig';

export class OpenAIService {
  private openai: OpenAI;

  constructor(
    private readonly systemPrompt: string,
    private readonly model = 'gpt-4o-mini',
    private readonly temperature = 0.7,
    langfuseConfig: LangfuseConfig,
    apiKey: string = env.OPENAI_API_KEY,
  ) {
    const openai = new OpenAI({ apiKey });
    this.openai = observeOpenAI(openai, {
      parent: langfuseConfig?.span || langfuseConfig.trace,
      generationName: langfuseConfig.name,
    });
  }

  async complete(message: string): Promise<string | null> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: this.temperature,
    });

    return chatCompletion.choices[0].message.content;
  }
}
