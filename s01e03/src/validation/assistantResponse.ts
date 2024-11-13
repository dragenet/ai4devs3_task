import { z } from 'zod';

export const assistantResponseSchema = z.object({
  response: z.string(),
});
