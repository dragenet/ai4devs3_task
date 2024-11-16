import { appEnvSchema } from '../validation/env.validation';
import { validateEnv } from './env.config';

const env = validateEnv(appEnvSchema);

export const config = {
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  data: {
    transcriptions: env.TRANSCRIPTIONS_PATH,
  },
  api: {
    baseUrl: env.API_BASE_URL,
    upload: env.UPLOAD_ENDPOINT,
    key: env.API_KEY,
  },
} as const;
