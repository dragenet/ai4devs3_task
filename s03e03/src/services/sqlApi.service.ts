import { HttpService } from 'common/services/http';

import type { ToolService } from '../types/toolService.interface';

interface SqlApiResponse {
  reply: Record<string, string | number>;
  error?: string;
}

export class SqlApiService implements ToolService {
  constructor(private readonly httpService: HttpService, private readonly sqlApiPath: string) {}

  async query(query: string) {
    const response = await this.httpService.post(this.sqlApiPath, { query, task: 'database' });
    return response.json().then((res: SqlApiResponse) => JSON.stringify(res.reply));
  }
}
