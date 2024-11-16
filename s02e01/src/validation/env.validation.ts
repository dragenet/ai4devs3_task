import { z } from 'zod';

const baseEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  TRANSCRIPTIONS_PATH: z.string(),
});

export const transcribeEnvSchema = baseEnvSchema.extend({
  RESOURCES_PATH: z.string(),
});

export const appEnvSchema = baseEnvSchema.extend({
  API_BASE_URL: z.string(),
  API_KEY: z.string(),
  UPLOAD_ENDPOINT: z.string(),
});
