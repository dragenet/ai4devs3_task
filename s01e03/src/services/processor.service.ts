import type { Langfuse, LangfuseTraceClient } from 'langfuse';

import { toolsConfig } from '../config/tools.config';
import { ClassifierService } from './classifier.service';

type ProcessResult = {
  result?: string | number;
  error?: unknown;
};

export class ProcessorService {
  private classifierService: ClassifierService;
  private trace: LangfuseTraceClient;

  constructor(
    private readonly query: string,
    private readonly langfuse: Langfuse,
    sessionId?: string,
  ) {
    this.trace = this.langfuse.trace({
      name: 'process_query',
      input: this.query,
      sessionId: sessionId,
    });

    this.classifierService = new ClassifierService(this.trace);
  }

  async process(): Promise<ProcessResult> {
    // Classification step
    const tool = await this.classifyQuery();
    if (!tool) {
      throw new Error('Classification failed');
    }

    // Processing step
    const result = await this.processTool(tool);
    if (!result) {
      throw new Error('Processing failed');
    }

    this.trace.update({
      output: result,
    });

    return { result };
  }

  private async classifyQuery(): Promise<string> {
    return await this.classifierService.classify(this.query);
  }

  private async processTool(tool: string): Promise<string | number> {
    const selectedTool = toolsConfig[tool as keyof typeof toolsConfig].tool;
    const Tool = new selectedTool(this.trace);
    return await Tool.execute(this.query);
  }
}
