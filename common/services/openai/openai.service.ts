import { createByModelName } from '@microsoft/tiktokenizer';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import {
  DEFAULT_OPENAI_COMPLETION_MODEL_CONFIG,
  DEFAULT_OPENAI_EMBEDDING_MODEL_CONFIG,
  DEFAULT_OPENAI_IMAGE_GENERATION_MODEL_CONFIG,
  DEFAULT_OPENAI_TRANSCRIPTION_MODEL_CONFIG,
} from './openai.constants';
import type {
  OpenAICompletionOptions,
  OpenAIEmbeddingOptions,
  OpenAIImageGenerationOptions,
  OpenAITranscriptionOptions,
} from './openai.types';

export class OpenAIService {
  private tokenizers: Map<string, Awaited<ReturnType<typeof createByModelName>>> = new Map();
  private readonly IM_START = '<|im_start|>';
  private readonly IM_END = '<|im_end|>';
  private readonly IM_SEP = '<|im_sep|>';
  constructor(private openai: OpenAI) {}

  private async getTokenizer(modelName: string) {
    if (!this.tokenizers.has(modelName)) {
      const specialTokens: ReadonlyMap<string, number> = new Map([
        [this.IM_START, 100264],
        [this.IM_END, 100265],
        [this.IM_SEP, 100266],
      ]);
      const tokenizer = await createByModelName(modelName, specialTokens);
      this.tokenizers.set(modelName, tokenizer);
    }
    const tokenizer = this.tokenizers.get(modelName);

    if (!tokenizer) throw new Error(`Tokenizer not found for model: ${modelName}`);
    return tokenizer;
  }

  async countTokens(messages: ChatCompletionMessageParam[], model = 'gpt-4o'): Promise<number> {
    const tokenizer = await this.getTokenizer(model);

    let formattedContent = '';
    messages.forEach((message) => {
      formattedContent += `${this.IM_START}${message.role}${this.IM_SEP}${message.content || ''}${
        this.IM_END
      }`;
    });
    formattedContent += `${this.IM_START}assistant${this.IM_SEP}`;

    const tokens = tokenizer.encode(formattedContent, [this.IM_START, this.IM_END, this.IM_SEP]);
    return tokens.length;
  }

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
          ? modelOptions.jsonSchema
          : { type: 'json_object' }
        : { type: 'text' },
    });

    const content = chatCompletion.choices[0].message.content;

    if (!content) {
      console.log(chatCompletion);
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

  async createEmbedding(input: string, modelOptions: Partial<OpenAIEmbeddingOptions> = {}) {
    const embedding = await this.openai.embeddings.create({
      ...DEFAULT_OPENAI_EMBEDDING_MODEL_CONFIG,
      ...modelOptions,
      input,
    });

    return embedding.data[0].embedding;
  }
}
