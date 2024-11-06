import { z } from 'zod';

export const modelResponseSchema = z.object({
  text: z.string(),
  msgID: z.number(),
});
