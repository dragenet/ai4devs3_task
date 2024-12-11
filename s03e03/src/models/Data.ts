import type { PromptEntity } from '../types/PromptEntity';
import { normalizePromptEntity } from '../utils/normalizePromptEntity';

interface DataEntityBaseContructor {
  source: string;
  query: string;
  data?: string;
  error?: string;
}

interface DataEntityFullfiledContructor extends DataEntityBaseContructor {
  data: string;
}

interface DataEntityErrorContructor extends DataEntityBaseContructor {
  error: string;
}

export class DataEntity implements PromptEntity {
  source: string;
  query: string;
  data?: string;
  error?: string;

  constructor({ source, query, data }: DataEntityFullfiledContructor);
  constructor({ source, query, error }: DataEntityErrorContructor);
  constructor({ source, query, data, error }: DataEntityBaseContructor) {
    this.source = source;
    this.query = query;
    this.data = data;
    this.error = error;
  }

  toJSON() {
    return {
      source: this.source,
      query: this.query,
      data: this.data,
      error: this.error,
    };
  }

  toString() {
    return normalizePromptEntity(
      this.data
        ? `
<data sourceTool="${this.source}" query="${this.query}">
${this.data}
</data>
`
        : `<data sourceTool="${this.source}" query="${this.query}" error="${this.error}" />`,
    );
  }
}
