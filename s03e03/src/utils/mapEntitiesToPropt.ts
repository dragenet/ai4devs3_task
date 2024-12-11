import type { PromptEntity } from '../types/PromptEntity';

export const mapEntitiesToPrompt = (items: PromptEntity[]) =>
  items.map((item) => item.toString()).join('\n\n');
