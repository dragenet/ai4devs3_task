import OpenAI from 'openai';

import { defaultOpenAICompletionModelConfig } from '../constants/defaultOpenAIModelsConfig';
import { defaultOpenAITranscriptionConfig } from '../constants/defaultOpenAIModelsConfig';
import type { OpenAIModelConfig, OpenAIModelOptions } from '../types/ModelConfig';
import type { OpenAITranscriptionConfig, OpenAITranscriptionOptions } from '../types/ModelConfig';

export class OpenAIService {
  constructor(private openai: OpenAI) {}

  async complete(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    modelOptions?: OpenAIModelOptions,
    modelConfig: OpenAIModelConfig = defaultOpenAICompletionModelConfig,
  ) {
    if (messages.length === 0) {
      throw new Error('No messages provided');
    }

    const chatCompletion = await this.openai.chat.completions.create({
      ...modelConfig,
      messages,
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

  async transcribe(
    audio: File,
    modelOptions?: OpenAITranscriptionOptions,
    modelConfig: OpenAITranscriptionConfig = defaultOpenAITranscriptionConfig,
  ) {
    const transcription = await this.openai.audio.transcriptions.create({
      file: audio,
      model: modelConfig.model,
      language: modelOptions?.language,
      prompt: modelOptions?.prompt,
      response_format: modelOptions?.format ?? 'json',
      temperature: modelOptions?.temperature ?? modelConfig.temperature,
      timestamp_granularities: modelConfig.timestampGranularities,
    });

    if (!transcription) {
      throw new Error('No transcription in response');
    }

    return transcription.text;
  }
}
