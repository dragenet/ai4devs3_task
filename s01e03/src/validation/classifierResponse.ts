import { z } from 'zod';

export const classifierResponseSchema = z.object({
  tool: z.string(),
});
