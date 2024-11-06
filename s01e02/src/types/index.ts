import type { z } from 'zod';
import type { modelResponseSchema } from '../schemas/model.schema';

export type ModelResponse = z.infer<typeof modelResponseSchema>;
