import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type { z } from 'zod';

export class HttpService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create();
  }

  async get<T>(url: string, validator: z.ZodSchema<T>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url);
    return validator.parse(response.data);
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }
}
