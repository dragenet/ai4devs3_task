import { z } from 'zod';

const dateEntityTestSchema = z.object({
  q: z.string(),
  a: z.string(),
});

export type DateEntityTest = z.infer<typeof dateEntityTestSchema>;

export const dataEntityWithoutTestSchema = z.object({
  question: z.string(),
  answer: z.number(),
});

export const dataEntityWithTestSchema = dataEntityWithoutTestSchema.extend({
  test: dateEntityTestSchema,
});

export type DataEntityWithTest = z.infer<typeof dataEntityWithTestSchema>;

export const dataEntitySchema = z.union([dataEntityWithTestSchema, dataEntityWithoutTestSchema]);

export type DataEntity = z.infer<typeof dataEntitySchema>;

export const dataEntitiesSchema = z.array(dataEntitySchema);

export const dataSchema = z.object({
  apikey: z.string(),
  description: z.string(),
  copyright: z.string(),
  'test-data': dataEntitiesSchema,
});
