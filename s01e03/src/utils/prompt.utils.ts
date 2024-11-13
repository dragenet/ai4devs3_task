import { toolsConfig } from '../config/tools.config';

export function mapToolsToPrompt(tools: any): string {
  return Object.entries(toolsConfig)
    .map(([key, config]) => {
      return `name: ${config.name}
description: ${config.description}
cost: ${config.cost}`;
    })
    .join('\n\n');
}
