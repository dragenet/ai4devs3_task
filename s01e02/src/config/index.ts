import { validateEnv } from './env.config';

const env = validateEnv();

export const config = {
  openai: {
    apiKey: env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0,
  },
  api: {
    endpoint: env.API_ENDPOINT,
  },
} as const;
