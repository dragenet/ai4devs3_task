import type { OpenAIModelConfig, OpenAITranscriptionConfig } from '../types/ModelConfig';

export const defaultOpenAICompletionModelConfig: OpenAIModelConfig = {
  model: 'gpt-4o',
  temperature: 0,
};

export const defaultOpenAITranscriptionConfig: OpenAITranscriptionConfig = {
  model: 'whisper-1',
  temperature: 0.5,
};

export const MB = 1000000 as const;
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
