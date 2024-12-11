import { OpenAIService } from 'common/services/openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { DataEntity } from '../models/Data';
import { getPrompt } from '../prompts/prompt';
import type { Data } from '../types/data.types';
import type { ToolsConfig } from '../types/toolService.interface';
import {
  type ModelToolCallResponse,
  modelResponseJSONSchema,
  modelResponseSchema,
} from '../validation/modelResponse';

export class AgentService {
  private data: Data;
  private readonly toolsConfig: ToolsConfig;
  private readonly messages: ChatCompletionMessageParam[];
  private iteration = 1;

  constructor(private readonly openaiService: OpenAIService, toolsConfig?: ToolsConfig) {
    this.data = [];
    this.toolsConfig = toolsConfig || {};
    this.messages = [];
  }

  async run(question: string) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log(`Running iteration ${this.iteration}`);
      const modelResponse = await this.runIteration(question);
      console.log('Model response:', JSON.stringify(modelResponse, null, 2));
      if (modelResponse.type === 'answer') {
        return modelResponse;
      }
      console.log('Data:', JSON.stringify(this.data[this.data.length - 1], null, 2));
      this.iteration++;
    }
  }

  async runIteration(question: string) {
    const modelResponse = await this.queryModel(question);

    switch (modelResponse.type) {
      case 'answer':
        return modelResponse;
      case 'tool':
        this.data.push(await this.callTool(modelResponse));
        return modelResponse;
    }
  }

  async queryModel(question: string) {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: getPrompt(this.toolsConfig, this.data) },
      { role: 'user', content: question },
    ];

    const response = await this.openaiService.complete([...this.getLastMessages(5), ...messages], {
      model: 'gpt-4o-mini',
      json: true,
      jsonSchema: zodResponseFormat(modelResponseJSONSchema, 'json-response'),
    });

    this.messages.push(...messages, { role: 'assistant', content: response });

    return modelResponseSchema.parse(JSON.parse(response));
  }

  async callTool(toolCall: ModelToolCallResponse) {
    try {
      const tool = this.toolsConfig[toolCall.tool];
      if (!tool) {
        throw new Error(`Tool ${toolCall.tool} does not exists`);
      }

      const result = await tool.service.query(toolCall.query);

      return new DataEntity({
        source: toolCall.tool,
        query: toolCall.query,
        data: result,
      });
    } catch (error: unknown) {
      return new DataEntity({
        source: toolCall.tool,
        query: toolCall.query,
        error: (error as Error)?.message || 'Unknown error',
      });
    }
  }

  private getLastMessages(quantity: number) {
    return this.messages.slice(-quantity);
  }
}
