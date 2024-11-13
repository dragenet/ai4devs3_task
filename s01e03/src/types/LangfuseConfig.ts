import type { LangfuseSpanClient, LangfuseTraceClient } from 'langfuse';

export interface LangfuseConfig {
  name: string;
  trace: LangfuseTraceClient;
  span?: LangfuseSpanClient;
}
