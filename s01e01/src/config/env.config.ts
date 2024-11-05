import { z } from 'zod';

const envSchema = z.object({
    OPENAI_API_KEY: z.string().min(1),
    TARGET_URL: z.string(),
    API_ENDPOINT: z.string(),
    FORM_USERNAME: z.string().min(1),
    FORM_PASSWORD: z.string().min(1),
});

export const validateEnv = () => {
    const parsed = envSchema.safeParse(process.env);
    
    if (!parsed.success) {
        console.error('❌ Invalid environment variables:', parsed.error.format());
        throw new Error('Invalid environment variables');
    }
    
    return parsed.data;
}; 