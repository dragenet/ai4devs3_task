import path from 'path';

export interface HttpServiceGetOptions {
  json?: boolean;
}

const defaultGetOptions: HttpServiceGetOptions = {
  json: true,
};

export class HttpService {
  constructor(private readonly baseUrl: string = '', private readonly apiKey?: string) {}

  async get<T>(url: string, options: HttpServiceGetOptions = defaultGetOptions): Promise<T> {
    const currentOptions = { ...defaultGetOptions, ...options };
    const response = await fetch(this.getUrl(url));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await (currentOptions.json ? response.json() : response.text());
  }

  async post<T>(url: string, data: Record<string, unknown>): Promise<T> {
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
      console.error(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  private getUrl(urlPath: string) {
    return path.join(this.baseUrl, urlPath);
  }
}
