import { OpenAIService } from './openai.service';
import { yearResponseSchema } from '../schemas/model.schema';
import type { ScrapedData, ProcessedData } from '../types';

export class AnswerService {
    constructor(private readonly openaiService: OpenAIService) {}

    async processAnswer(data: ScrapedData, userQuery: string) {
        const modelResponse = await this.openaiService.complete(data, userQuery);
        const validatedYear = yearResponseSchema.parse(modelResponse);
        
        return {
            answer: validatedYear.toString()
        };
    }
} 