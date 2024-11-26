import type { OpenAIService } from 'common/services/openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { extractPeoplePrompt } from '../prompts/extractPeople.prompt';

export const extractPeopleFromText = async (text: string, openaiService: OpenAIService) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: extractPeoplePrompt,
    },
    {
      role: 'user',
      content: text,
    },
  ];

  return await openaiService.complete(messages, { model: 'gpt-4o-mini' });
};
