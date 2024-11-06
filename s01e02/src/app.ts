import { Message } from './domain/message';
import { MessageProcessor } from './domain/message-processor';
import { config } from './config';
import { HttpService } from './services/http.service';
import { OpenAIService } from './services/openai.service';

export class Application {
  private readonly messageProcessor: MessageProcessor;
  private retryCount = 1;
  private readonly maxRetries: number;

  constructor(maxRetries: number = 10) {
    const httpService = new HttpService();
    const openaiService = new OpenAIService(
      config.openai.apiKey,
      config.openai.model,
      config.openai.temperature
    );

    this.messageProcessor = new MessageProcessor(openaiService, httpService, config.api.endpoint);
    this.maxRetries = maxRetries;
  }

  async run() {
    let currentMessage = Message.create('READY', 0);

    try {
      console.log(`Retry ${this.retryCount}`);
      while (true) {
        if (this.retryCount > this.maxRetries) {
          throw new Error('Max retries reached');
        }

        const processedMessage = await this.messageProcessor.processMessage(currentMessage);

        if (processedMessage.isProcessingError()) {
          this.retryCount++;
          console.log(`Failed: ${processedMessage.text}`);
          console.log(`Retry ${this.retryCount}`);
          currentMessage = Message.create('READY', 0);
          continue;
        }

        if (processedMessage.isFlagMessage()) {
          console.log('Flag found:', processedMessage.text);
          break;
        }

        currentMessage = await this.messageProcessor.generateNextMessage(processedMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in application loop:', error.message);
      }
      throw error;
    }
  }
}
