import { FileService } from 'common/services/file';
import { HttpService } from 'common/services/http';
import { OpenAIService } from 'common/services/openai';
import { nanoid } from 'nanoid';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { transformConfessionPrompt } from './promps/transformConfession.prompt';

const IMAGES_DIR = './images';
const TASK_NAME = 'robotid';

const main = async () => {
  if (
    !process.env.OPENAI_API_KEY ||
    !process.env.CONFESSION_URL ||
    !process.env.REPORT_API_URL ||
    !process.env.REPORT_API_KEY
  ) {
    throw new Error('Missing environment variables');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const openaiService = new OpenAIService(openai);
  const httpService = new HttpService();
  const apiService = new HttpService(undefined, process.env.REPORT_API_KEY);
  const fileService = new FileService(IMAGES_DIR);

  const confession = (await httpService.get(process.env.CONFESSION_URL).then((res) => res.json()))
    .description;

  console.log('Confession:', confession);

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: transformConfessionPrompt,
    },
    {
      role: 'user',
      content: confession,
    },
  ];

  const description = await openaiService.complete(messages, {
    temperature: 1.2,
  });

  console.log('Description:', description);

  const imageUrl = await openaiService.generateImage(description);
  console.log('Image URL:', imageUrl);

  const image = await httpService.get(imageUrl).then((res) => res.arrayBuffer());

  const fileInfo = await fileService.saveFile(`${nanoid(5)}.png`, Buffer.from(image));
  console.log('Image saved to:', fileInfo.relativePath);

  const report = {
    task: TASK_NAME,
    answer: imageUrl,
  };

  const response = await apiService
    .post(process.env.REPORT_API_URL, report)
    .then((res) => res.json());
  console.log('Report sent:', response);
};

main();
