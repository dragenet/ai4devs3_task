import { type CacheEntryWithContent, CacheService } from 'common/services/cache';
import { type FileInfo, FileService } from 'common/services/file';
import { OpenAIService } from 'common/services/openai';

const CACHE_OPERATION = 'transcription';

export class TranscriptionService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly fileService: FileService,
    private readonly cacheService: CacheService,
  ) {}

  async transcribe(file: FileInfo): Promise<CacheEntryWithContent> {
    const audioFile = await this.fileService.readFile(file.relativePath);

    return this.cacheService.withCachedEntry(file, CACHE_OPERATION, () =>
      this.openAIService.transcribe(audioFile),
    );
  }
}
