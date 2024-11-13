import type Langfuse from 'langfuse';

import type { DataEntity, DataEntityWithTest } from '../validation/providedData';
import { ProcessorService } from './processor.service';

export class EntityProcessorService {
  constructor(private readonly langfuse: Langfuse, private readonly sessionId?: string) {}

  async process(entity: DataEntity) {
    const processors: ProcessorService[] = this.createProcessors(entity);

    const results = await Promise.all(processors.map((processor) => processor.process()));

    const entityAnswer = results[0].result;
    const testAnswer = results?.[1]?.result;

    const baseResult = {
      ...entity,
      answer: entityAnswer,
    };

    return this.isTestEntity(entity)
      ? {
          ...baseResult,
          test: {
            ...entity.test,
            a: testAnswer,
          },
        }
      : baseResult;
  }

  private createProcessors(entity: DataEntity) {
    const processors: ProcessorService[] = [];

    processors.push(new ProcessorService(entity.question, this.langfuse, this.sessionId));

    if (this.isTestEntity(entity)) {
      processors.push(new ProcessorService(entity.test.q, this.langfuse, this.sessionId));
    }

    return processors;
  }

  private isTestEntity(entity: DataEntity): entity is DataEntityWithTest {
    return (entity as DataEntityWithTest)?.test !== undefined;
  }
}
