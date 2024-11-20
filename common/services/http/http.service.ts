import path from 'path';

export class HttpService {
  constructor(private readonly baseUrl: string = '', private readonly apiKey?: string) {}

  async get(url: string) {
    const response = await fetch(this.getUrl(url));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async post<T extends Record<string, unknown>>(url: string, data: T) {
    const response = await fetch(this.getUrl(url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        this.apiKey
          ? {
              apikey: this.apiKey,
              ...data,
            }
          : data,
      ),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  private getUrl(urlPath: string) {
    return path.join(this.baseUrl, urlPath);
  }
}
