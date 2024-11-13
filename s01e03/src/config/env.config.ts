import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
  API_GET_URL: z.string().url(),
  API_POST_URL: z.string().url(),
  API_KEY: z.string(),
  LANGFUSE_PUBLIC_KEY: z.string().optional(),
  LANGFUSE_SECRET_KEY: z.string().optional(),
  LANGFUSE_BASEURL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
