export const normalizePromptEntity = (entity: string) =>
  entity
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.trim())
    .join('\n');
