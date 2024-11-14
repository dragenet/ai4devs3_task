import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  API_BASE_URL: z.string().url(),
  RESOURCES_ENDPOINT: z.string(),
  UPLOAD_ENDPOINT: z.string(),
  API_KEY: z.string().min(1),
});

export const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};
