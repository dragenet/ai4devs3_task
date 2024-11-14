import { validateEnv } from './env.config';

const env = validateEnv();

export const config = {
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  api: {
    baseUrl: env.API_BASE_URL,
    resources: env.RESOURCES_ENDPOINT,
    upload: env.UPLOAD_ENDPOINT,
    key: env.API_KEY,
  },
} as const;
