import { z } from 'zod';

export const classifyResponseSchema = z.object({
  _thoughts: z.string().optional(),
  category: z.enum(['hardware', 'software', 'people', 'other']),
});
