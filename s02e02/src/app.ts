import OpenAI from 'openai';
import sharp from 'sharp';

import { config } from './config/app';
import { systemPrompt } from './prompts/systemPrompt';
import { FileService } from './services/file.service';
import { OpenAIService } from './services/openai.service';

const fileService = new FileService();
const openai = new OpenAI({ apiKey: config.openai.apiKey });
const openaiService = new OpenAIService(openai);

const mapFragments = await fileService.getFilesList('maps');

const preparedImages = await Promise.all(
  mapFragments.map(async (fragment) =>
    (
      await sharp(fragment.relativePath).resize(2048, 2048, { fit: 'inside' }).toBuffer()
    ).toString('base64'),
  ),
);

const imagesContent: OpenAI.Chat.Completions.ChatCompletionContentPartImage[] = preparedImages.map(
  (image) => ({
    type: 'image_url' as const,
    image_url: {
      url: `data:image/jpeg;base64,${image}`,
      detail: 'high',
    },
  }),
);

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: systemPrompt,
  },
  {
    role: 'user',
    content: [
      ...imagesContent,
      {
        type: 'text' as const,
        text: 'What is the name of the city on these maps?',
      },
    ],
  },
];

const result = await openaiService.complete(messages);

console.log(result);
