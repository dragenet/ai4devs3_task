import { segmentationEnvSchema } from '../validation/env.validation';
import { validateEnv } from './env.config';

const env = validateEnv(segmentationEnvSchema);

export const config = {
  replicate: {
    apiKey: env.REPLICATE_API_KEY,
  },
} as const;
