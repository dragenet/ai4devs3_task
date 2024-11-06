import { modelResponseSchema } from '../schemas/model.schema';
import type { ModelResponse } from '../types';

export class HttpService {
  async post<T extends ModelResponse>(url: string, data: Record<string, unknown>): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return modelResponseSchema.parse(responseData) as T;
  }
}
