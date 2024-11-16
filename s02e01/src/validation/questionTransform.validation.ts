import { z } from 'zod';

// Schema for the expected response format from OpenAI
export const questionTransformResponseSchema = z
  .object({
    _thoughts: z.string().optional(),
    question: z.string().min(1, {
      message: 'Question section cannot be empty',
    }),
  })
  .strict({
    message: 'Response contains unrecognized fields',
  });

// Type inference from the schema
export type QuestionTransformResponse = z.infer<typeof questionTransformResponseSchema>;
