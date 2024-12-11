import type { PromptEntity } from '../types/PromptEntity';
import type { ToolService } from '../types/toolService.interface';
import { normalizePromptEntity } from '../utils/normalizePromptEntity';

interface ToolConstructor {
  name: string;
  description: string;
  service: ToolService;
  answer: 'string' | 'json';
}

export class Tool implements PromptEntity {
  name: string;
  description: string;
  service: ToolService;
  answer: 'string' | 'json';
  constructor({ name, description, service, answer }: ToolConstructor) {
    this.name = name;
    this.description = description;
    this.service = service;
    this.answer = answer;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      answer: this.answer,
    };
  }

  toString() {
    return normalizePromptEntity(`
<tool name="${this.name}" answerFormat="${this.answer}">
${this.description}
</tool>
`);
  }
}
