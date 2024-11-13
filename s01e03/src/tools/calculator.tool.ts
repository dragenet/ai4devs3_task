import type { LangfuseSpanClient, LangfuseTraceClient } from 'langfuse';

import type { Tool } from './tool.interface';

export class CalculatorTool implements Tool {
  private span: LangfuseSpanClient;

  constructor(private readonly trace: LangfuseTraceClient) {
    this.span = trace.span({
      name: 'calculator_tool',
    });
  }

  async execute(query: string): Promise<number> {
    const result = await this.calculate(query);
    this.span.end();
    this.span.event({
      name: 'calculation_completed',
      output: result,
    });
    return result;
  }

  async calculate(query: string): Promise<number> {
    // Remove all whitespace and validate expression
    const expr = query.replace(/\s/g, '');
    if (!CalculatorTool.isApplicable(expr)) {
      throw new Error('Invalid expression');
    }

    // Safe eval using Function
    return new Function(`return ${expr}`)();
  }

  static isApplicable(query: string) {
    const expr = query.replace(/\s/g, '');
    return /^\d+[+\-*/]\d+$/.test(expr);
  }
}
