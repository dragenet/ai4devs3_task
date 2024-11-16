import { z } from 'zod';

// Schema for the expected response format from OpenAI
export const answerResponseSchema = z
  .object({
    _thoughts: z.string().optional(),
    answer: z.string().min(1, {
      message: 'Answer section cannot be empty',
    }),
  })
  .strict({
    message: 'Response contains unrecognized fields',
  });

// Type inference from the schema
export type AnswerResponse = z.infer<typeof answerResponseSchema>;
