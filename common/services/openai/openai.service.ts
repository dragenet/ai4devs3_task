import OpenAI from 'openai';

import {
  DEFAULT_OPENAI_COMPLETION_MODEL_CONFIG,
  DEFAULT_OPENAI_IMAGE_GENERATION_MODEL_CONFIG,
  DEFAULT_OPENAI_TRANSCRIPTION_MODEL_CONFIG,
} from './openai.constants';
import type {
  OpenAICompletionOptions,
  OpenAIImageGenerationOptions,
  OpenAITranscriptionOptions,
} from './openai.types';

export class OpenAIService {
  constructor(private openai: OpenAI) {}

  async complete(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    modelOptions: Partial<OpenAICompletionOptions> = {},
  ) {
    if (messages.length === 0) {
      throw new Error('No messages provided');
    }

    const chatCompletion = await this.openai.chat.completions.create({
      ...{
        ...DEFAULT_OPENAI_COMPLETION_MODEL_CONFIG,
        ...modelOptions,
        json: undefined,
        jsonSchema: undefined,
      },
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

  async transcribe(audio: File, modelOptions: Partial<OpenAITranscriptionOptions> = {}) {
    const transcription = await this.openai.audio.transcriptions.create({
      ...DEFAULT_OPENAI_TRANSCRIPTION_MODEL_CONFIG,
      ...modelOptions,
      file: audio,
    });

    if (!transcription) {
      throw new Error('No transcription in response');
    }

    return transcription.text;
  }

  async generateImage(prompt: string, modelOptions: Partial<OpenAIImageGenerationOptions> = {}) {
    const image = await this.openai.images.generate({
      ...DEFAULT_OPENAI_IMAGE_GENERATION_MODEL_CONFIG,
      ...modelOptions,
      prompt,
      n: 1,
    });

    if (!image || !image.data[0].url) {
      throw new Error('No image in response');
    }

    return image.data[0].url;
  }
}
