import { z } from 'zod';

export const modelResponseTypesSchema = z.enum(['answer', 'tool']);

// Base schema with common fields
const modelResponseBase = z.object({
  _thoughts: z.string().optional(),
  type: modelResponseTypesSchema, // Using enum for better type safety
});

// Answer response schema
const modelAnswerResponse = modelResponseBase.extend({
  type: z.literal(modelResponseTypesSchema.enum.answer),
  answer: z.string(),
});

// Tool call response schema
const modelToolCallResponse = modelResponseBase.extend({
  type: z.literal(modelResponseTypesSchema.enum.tool),
  tool: z.string(),
  query: z.string(),
});

// Combined response schema using discriminated union
export const modelResponseSchema = z.discriminatedUnion('type', [
  modelAnswerResponse,
  modelToolCallResponse,
]);

export const modelResponseJSONSchema = z.object({
  type: modelResponseTypesSchema,
  _thoughts: z.string().optional(),
  answer: z.string().optional(),
  tool: z.string().optional(),
  query: z.string().optional(),
});

// Export individual schemas for specific validation needs
export type ModelResponse = z.infer<typeof modelResponseSchema>;
export type ModelAnswerResponse = z.infer<typeof modelAnswerResponse>;
export type ModelToolCallResponse = z.infer<typeof modelToolCallResponse>;
