import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const yearResponseSchema = z.string()
    .regex(/^\d{1,4}$/, "Response must be 1-4 digits")
    .transform((val) => parseInt(val, 10))
    .pipe(
        z.number()
        .int()
        .min(0, { message: "Year must be 0 or greater" })
        .max(currentYear, { message: "Year must be in the past or present" })
    );

export type YearResponse = z.infer<typeof yearResponseSchema>;