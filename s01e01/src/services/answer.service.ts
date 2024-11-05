import { OpenAIService } from './openai.service';
import { yearResponseSchema } from '../schemas/model.schema';

export class AnswerService {
    constructor(private readonly openaiService: OpenAIService) {}

    async processAnswer(query: string) {
        const modelResponse = await this.openaiService.complete(query);

        console.log('Model response:', modelResponse);
        
        if (modelResponse === '-1') {
            throw new Error('Unable to determine the year for the given query');
        }
        
        const validatedYear = yearResponseSchema.parse(modelResponse);
        
        return {
            answer: validatedYear.toString()
        };
    }
} 