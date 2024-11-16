import { transcribeEnvSchema } from '../validation/env.validation';
import { validateEnv } from './env.config';

const env = validateEnv(transcribeEnvSchema);

export const config = {
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  data: {
    resources: env.RESOURCES_PATH,
    transcriptions: env.TRANSCRIPTIONS_PATH,
  },
} as const;
