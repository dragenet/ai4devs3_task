import type OpenAI from 'openai';

import { transcriptionCorrectionPrompt } from '../prompts/transcriptionCorrection.prompt';
import type { FileInfo } from '../types/FileInfo';
import { FileService } from './file.service';
import { OpenAIService } from './openai.service';

interface TranscribeResult {
  transcription: string;
}

interface RefinedTranscriptionResult extends TranscribeResult {
  refinedTranscription: string;
}

export class TranscribeService {
  constructor(
    private readonly fileService: FileService,
    private readonly openAIService: OpenAIService,
  ) {}

  async transcribeFile(fileInfo: FileInfo, correctTranscription?: false): Promise<TranscribeResult>;
  async transcribeFile(
    fileInfo: FileInfo,
    correctTranscription: true,
  ): Promise<RefinedTranscriptionResult>;
  async transcribeFile(
    fileInfo: FileInfo,
    correctTranscription?: boolean,
  ): Promise<RefinedTranscriptionResult | TranscribeResult> {
    try {
      // Get file buffer/stream from FileService
      const fileData = await this.fileService.readFile(fileInfo.relativePath);

      // Send to OpenAI for transcription
      const transcription = await this.openAIService.transcribe(fileData);

      if (correctTranscription) {
        const refinedTranscription = await this.refineTranscription(transcription);
        return { transcription, refinedTranscription };
      }

      return { transcription };
    } catch (error: unknown) {
      throw new Error(`Failed to transcribe file: ${(error as Error).message}`);
    }
  }

  private async refineTranscription(transcription: string): Promise<string> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: transcriptionCorrectionPrompt,
      },
      {
        role: 'user',
        content: transcription,
      },
    ];

    const refinedTranscription = await this.openAIService.complete(messages);
    return refinedTranscription;
  }
}
