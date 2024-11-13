import { AssistantTool } from '../tools/assistant.tool';
import { CalculatorTool } from '../tools/calculator.tool';

export const toolsConfig = {
  calculator: {
    name: 'calculator',
    description: 'Performs basic mathematical calculations',
    cost: 1,
    tool: CalculatorTool,
  },
  assistant: {
    name: 'assistant',
    description: 'Answers general purpose questions',
    cost: 2,
    tool: AssistantTool,
  },
};
