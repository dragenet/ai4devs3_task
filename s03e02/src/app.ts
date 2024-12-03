import { HttpService } from 'common/services/http';
import { OpenAIService } from 'common/services/openai';
import { VectorService } from 'common/services/vector';
import OpenAI from 'openai';

const API_URL = 'https://centrala.ag3nts.org/report';

const main = async () => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const openaiService = new OpenAIService(openai);
  const vectorService = new VectorService(openaiService);
  const httpService = new HttpService('', process.env.API_KEY);

  const result = await vectorService.performSearch(
    'docs',
    'W raporcie, z którego dnia znajduje się wzmianka o kradzieży prototypu broni?',
    1,
  );

  const requestBody = {
    task: 'wektory',
    answer: result[0]?.payload?.date,
  };

  const response = await httpService.post(API_URL, requestBody).then((res) => res.json());

  console.log(response);
};

main();
