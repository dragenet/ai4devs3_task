import type { LangfuseTraceClient } from 'langfuse';

import { CalculatorTool } from '../tools/calculator.tool';

const langfuseClassifierConfig = {
  name: 'classify_query',
} as const;

export class ClassifierService {
  constructor(private readonly trace: LangfuseTraceClient) {
    // const { model, temperature } = modelsConfig.classifier;
    // this.openaiService = new OpenAIService(classifierPrompt, model, temperature, {
    //   ...langfuseClassifierConfig,
    //   trace,
    // });
  }

  async classify(query: string) {
    // const response = await this.openaiService.complete(query);
    // if (!response) throw new Error('No response from classifier');

    // const parsed = classifierResponseSchema.parse(JSON.parse(response));
    // return parsed.tool;
    const result = CalculatorTool.isApplicable(query) ? 'calculator' : 'assistant';
    this.trace.event({
      ...langfuseClassifierConfig,
      output: result,
    });
    return CalculatorTool.isApplicable(query) ? 'calculator' : 'assistant';
  }
}
