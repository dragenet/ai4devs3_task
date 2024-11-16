import { z } from 'zod';

// Schema for the expected response format from OpenAI
export const summarizeResponseSchema = z
  .object({
    _thoughts: z.string().optional(),
    result: z.string().min(1, {
      message: 'Result section cannot be empty',
    }),
  })
  .strict({
    message: 'Response contains unrecognized fields',
  });

// Type inference from the schema
export type SummarizeResponse = z.infer<typeof summarizeResponseSchema>;
