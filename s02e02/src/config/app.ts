import { appEnvSchema } from '../validation/env.validation';
import { validateEnv } from './env.config';

const env = validateEnv(appEnvSchema);

export const config = {
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
} as const;
