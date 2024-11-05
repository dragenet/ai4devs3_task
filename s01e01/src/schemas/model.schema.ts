import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const yearResponseSchema = z.string()
    .regex(/^\d{4}$/, "Response must be exactly 4 digits")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val <= currentYear, {
        message: "Year must be in the past or present"
    });

export type YearResponse = z.infer<typeof yearResponseSchema>; 