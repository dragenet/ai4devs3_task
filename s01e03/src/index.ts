import { randomUUID } from 'crypto';
import Langfuse from 'langfuse';

import { env } from './config/env.config';
import { EntityProcessorService } from './services/entityProcessor.service';
import { HttpService } from './services/http.service';
import { dataSchema } from './validation/providedData';

const langfuse = new Langfuse();

async function main() {
  const sessionId = randomUUID();
  console.log('Senssion ID:', sessionId);

  const httpService = new HttpService();
  const entityProcessorService = new EntityProcessorService(langfuse, sessionId);

  console.log('Fetching data...');
  const data = await httpService.get(env.API_GET_URL, dataSchema);
  const dataEntities = data['test-data'];

  console.log('Processing data...');
  const processedData = await Promise.all(
    dataEntities.map((entity) => entityProcessorService.process(entity)),
  );

  const reponseData = {
    ...data,
    apikey: env.API_KEY,
    'test-data': processedData,
  };

  const response = {
    task: 'JSON',
    apikey: env.API_KEY,
    answer: reponseData,
  };

  Bun.write('response.json', JSON.stringify(response, null, 2));

  dataSchema.parse(reponseData);

  console.log('Sending response...');
  const result = await httpService
    .post(env.API_POST_URL, response)
    .catch(({ status, data }) => console.log('Network error:', { status, data }));

  console.log('Response sent:', result);
}

main()
  .catch((error) => console.error(error.message))
  .finally(() => langfuse.flushAsync());
