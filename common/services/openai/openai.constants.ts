import type {
  OpenAICompletionOptions,
  OpenAIImageGenerationOptions,
  OpenAITranscriptionOptions,
} from './openai.types';

//General
export const MB = 1000000 as const;

// Completion model config
export const DEFAULT_OPENAI_COMPLETION_MODEL_CONFIG: OpenAICompletionOptions = {
  model: 'gpt-4o',
  temperature: 0,
};

// Transcription model config
export const DEFAULT_OPENAI_TRANSCRIPTION_MODEL_CONFIG: OpenAITranscriptionOptions = {
  model: 'whisper-1',
  temperature: 0.5,
  response_format: 'json',
};

export const MAX_TRANSCRIPTION_FILE_SIZE = 25 * MB;
export const SUPPORTED_TRANSCRIPTION_FILE_EXTENSIONS = [
  'mp3',
  'mp4',
  'mpeg',
  'mpga',
  'm4a',
  'wav',
  'webm',
];

// Image generation model config
export const DEFAULT_OPENAI_IMAGE_GENERATION_MODEL_CONFIG: OpenAIImageGenerationOptions = {
  model: 'dall-e-3',
  size: '1024x1024',
};
