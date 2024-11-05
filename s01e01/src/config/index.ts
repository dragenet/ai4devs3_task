import { validateEnv } from './env.config';

const env = validateEnv();

export const config = {
    openai: {
        apiKey: env.OPENAI_API_KEY,
        model: 'gpt-4o',
        maxTokens: 1000,
        temperature: 0,
    },
    scraping: {
        targetUrl: env.TARGET_URL,
    },
    api: {
        endpoint: env.API_ENDPOINT,
        credentials: {
            username: env.FORM_USERNAME,
            password: env.FORM_PASSWORD,
        }
    },
} as const; 