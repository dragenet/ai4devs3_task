import OpenAI from 'openai';
import type { ScrapedData } from '../types';
import { dataProcessingPrompt } from '../prompts/data-processing.prompt';

export class OpenAIService {
    private openai: OpenAI;

    constructor(
        apiKey: string,
        private readonly model = 'gpt-4o',
        private readonly maxTokens = 4,
        private readonly temperature = 0.7
    ) {
        this.openai = new OpenAI({ apiKey });
    }

    async complete(query: string) {
        const chatCompletion = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: dataProcessingPrompt
                },
                {
                    role: 'user',
                    content: query
                }
            ],
            max_tokens: this.maxTokens,
            temperature: this.temperature,
        });

        return chatCompletion.choices[0].message.content?.trim() ?? null;
    }
} 