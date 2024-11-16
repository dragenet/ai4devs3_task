import type { ClientOptions } from 'openai';
import type { ResponseFormatJSONSchema } from 'openai/resources/shared.mjs';

export type OpenAIClientConfig = Pick<ClientOptions, 'apiKey' | 'baseURL'>;

export interface OpenAIModelConfig {
  readonly model: string;
  readonly temperature?: number;
}

export interface OpenAIModelOptionsWithoutJson {
  readonly json?: false;
}

export interface OpenAIModelOptionsWithJsonSchema {
  readonly json: true;
  readonly jsonSchema?: ResponseFormatJSONSchema.JSONSchema;
}

export type OpenAIModelOptions = OpenAIModelOptionsWithoutJson | OpenAIModelOptionsWithJsonSchema;

export type TimestampGranularity = 'word' | 'segment';

export interface OpenAITranscriptionConfig extends OpenAIModelConfig {
  readonly timestampGranularities?: TimestampGranularity[];
  readonly temperature?: number;
}

export interface OpenAITranscriptionOptions {
  readonly format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  readonly language?: string;
  readonly prompt?: string;
  readonly temperature?: number;
}
