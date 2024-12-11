import type OpenAI from 'openai';
import type { ResponseFormatJSONSchema } from 'openai/resources/shared.mjs';

// Completion model types
export type OpenAIBaseCompletionOptions = Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParams,
  'messages' | 'response_format' | 'stream'
>;

export interface OpenAICompletionOptionsWithoutJsonSchema extends OpenAIBaseCompletionOptions {
  readonly json?: false;
}

export interface OpenAICompletionOptionsWithJsonSchema extends OpenAIBaseCompletionOptions {
  readonly json: true;
  readonly jsonSchema?: ResponseFormatJSONSchema;
}

export type OpenAICompletionOptions =
  | OpenAICompletionOptionsWithoutJsonSchema
  | OpenAICompletionOptionsWithJsonSchema;

// Transcription model types
export type OpenAITranscriptionOptions = Omit<
  OpenAI.Audio.Transcriptions.TranscriptionCreateParams,
  'file'
>;

// Image generation model types
export type OpenAIImageGenerationOptions = Omit<OpenAI.Images.ImageGenerateParams, 'prompt' | 'n'>;

// Embedding model types
export type OpenAIEmbeddingOptions = Omit<OpenAI.Embeddings.EmbeddingCreateParams, 'input'>;
