import type { Tool } from '../models/Tool';

export interface ToolService {
  query(query: string): Promise<string>;
}

export type ToolsConfig = Record<string, Tool>;
