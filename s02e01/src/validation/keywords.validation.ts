import { z } from 'zod';

// Schema for the expected response format from OpenAI
export const keywordsResponseSchema = z
  .object({
    _thoughts: z.string().optional(),
    response: z.array(z.string()),
  })
  .strict({
    message: 'Response contains unrecognized fields',
  });

// Type inference from the schema
export type KeywordsResponse = z.infer<typeof keywordsResponseSchema>;
