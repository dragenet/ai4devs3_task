import { Message } from './message';
import { OpenAIService } from '../services/openai.service';
import { HttpService } from '../services/http.service';
import type { ModelResponse } from '../types';

export class MessageProcessor {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly httpService: HttpService,
    private readonly apiEndpoint: string
  ) {}

  async processMessage(message: Message): Promise<Message> {
    const response = await this.httpService.post<ModelResponse>(this.apiEndpoint, message.toJSON());
    return Message.fromResponse(response);
  }

  async generateNextMessage(message: Message): Promise<Message> {
    const response = await this.openAIService.complete(message.toJSON());
    return Message.fromResponse(response);
  }
}
