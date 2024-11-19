import { z } from 'zod';

export const segmentationEnvSchema = z.object({
  REPLICATE_API_KEY: z.string(),
});

export const appEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
});
