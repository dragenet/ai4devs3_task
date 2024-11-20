import { type CacheEntryWithContent, CacheService } from 'common/services/cache';
import { type FileInfo, FileService } from 'common/services/file';
import { OpenAIService } from 'common/services/openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { extractTextFromImagePrompt } from '../prompts/image.prompt';

export class ImageService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly fileService: FileService,
    private readonly cacheService: CacheService,
  ) {}

  async extractText(file: FileInfo): Promise<CacheEntryWithContent> {
    return await this.cacheService.withCachedEntry(file.relativePath, 'image_ocr', async () => {
      const imageData = await this.fileService.readFile(file.relativePath);
      const base64Image = await imageData
        .arrayBuffer()
        .then((buffer) => Buffer.from(buffer).toString('base64'));

      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: extractTextFromImagePrompt },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } },
            { type: 'text', text: 'Extract text from image' },
          ],
        },
      ];

      const result = await this.openAIService.complete(messages);
      return result;
    });
  }
}
