export interface Tool {
  execute(query: string): Promise<string | number>;
}
