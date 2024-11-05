import { ScraperService, type PageEvaluator } from './services/scraper.service';
import { OpenAIService } from './services/openai.service';
import { HttpService } from './services/http.service';
import { config } from './config';
import type { CheerioAPI } from 'cheerio';
import type { ScrapedData, FormData } from './types';
import { SELECTORS } from './constants/selectors';
import { AnswerService } from './services/answer.service';
import { z } from 'zod';

const extractQuestionContent = (text: string) => 
    text
        .replace(/^Question:\s*/, '')
        .replace(/<[^>]*>/g, '')
        .trim();

const pageEvaluator: PageEvaluator = async ($: CheerioAPI) => {
    const questionElement = $(`#${SELECTORS.QUESTION_ELEMENT}`);
    
    if (!questionElement.length) {
        throw new Error(`Element with id "${SELECTORS.QUESTION_ELEMENT}" not found`);
    }

    const rawContent = questionElement.html();
    if (rawContent === null) {
        throw new Error('Question element is empty');
    }

    const question = extractQuestionContent(rawContent);
    if (!question) {
        throw new Error('Question content is empty after processing');
    }

    return { question };
};

async function main() {
    const scraperService = new ScraperService(config.scraping.targetUrl);
    // const openaiService = new OpenAIService(
    //     config.openai.apiKey,
    //     config.openai.model,
    //     config.openai.maxTokens,
    //     config.openai.temperature
    // );
    // const answerService = new AnswerService(openaiService);
    // const httpService = new HttpService();

    try {
        await scraperService.scrapeWebsite();
        const { question } = await scraperService.evaluateContent(pageEvaluator);
        // const processedData = await answerService.processAnswer(evaluatedData, userQuery);
        
        // const formData: FormData = {
        //     username: config.api.credentials.username,
        //     password: config.api.credentials.password,
        //     answer: processedData.answer,
        // };
        
        // const response = await httpService.submitForm(config.api.endpoint, formData);
        // console.log('API Response:', JSON.stringify(response, null, 2));
        // console.log('Process completed successfully');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in main process:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
        process.exit(1);
    }
}

main().catch(error => {
    console.error('Unhandled error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
});
