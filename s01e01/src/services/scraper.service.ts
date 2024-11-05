import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import type { ScrapedData } from '../types';

export type PageEvaluator = ($: CheerioAPI) => Promise<ScrapedData>;

export class ScraperService {
    private scrapedContent: string | null = null;

    constructor(private readonly targetUrl: string) {}

    async scrapeWebsite(): Promise<void> {
        try {
            const response = await fetch(this.targetUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.scrapedContent = await response.text();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error scraping ${this.targetUrl}:`, error.message);
            }
            throw error;
        }
    }

    async evaluateContent(evaluator: PageEvaluator): Promise<ScrapedData> {
        if (!this.scrapedContent) {
            throw new Error('No content available. Call scrapeWebsite first.');
        }

        const $ = cheerio.load(this.scrapedContent);
        return evaluator($);
    }
} 