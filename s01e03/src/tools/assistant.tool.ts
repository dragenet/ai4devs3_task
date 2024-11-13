import type { LangfuseTraceClient } from 'langfuse';

import { modelsConfig } from '../config/models.config';
import { assistantPrompt } from '../prompts/assistant.prompt';
import { OpenAIService } from '../services/openai.service';
import { assistantResponseSchema } from '../validation/assistantResponse';
import type { Tool } from './tool.interface';

const langfuseAssistantConfig = {
  name: 'assistant_tool',
} as const;

export class AssistantTool implements Tool {
  private openaiService: OpenAIService;

  constructor(trace: LangfuseTraceClient) {
    const { model, temperature } = modelsConfig.assistant;
    this.openaiService = new OpenAIService(assistantPrompt, model, temperature, {
      ...langfuseAssistantConfig,
      trace,
    });
  }

  async execute(query: string): Promise<string> {
    const response = await this.openaiService.complete(query);

    if (!response) {
      throw new Error('No response from assistant');
    }

    const parsedResponse = assistantResponseSchema.parse(JSON.parse(response));
    return parsedResponse.response;
  }
}
