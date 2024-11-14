import { OpenAI } from 'openai';

import { config } from './config/app';
import { systemPrompt } from './prompts/systemPrompt';
import { CensorService } from './services/censor.service';
import { HttpService } from './services/http.service';

const openai = new OpenAI({ apiKey: config.openai.apiKey });
const httpService = new HttpService(config.api.baseUrl, config.api.key);
const censorService = new CensorService(openai, systemPrompt);

const main = async () => {
  const textToCensore = await httpService.get<string>(config.api.resources, { json: false });
  console.log('Text to censor:', textToCensore);

  const censoredText = await censorService.censor(textToCensore);
  console.log('Censored text:', censoredText);

  const response = {
    task: 'CENZURA',
    answer: censoredText.result,
  };

  const uploadResponse = await httpService.post(config.api.upload, response);
  console.log('Upload response:', uploadResponse);
};

main().catch(console.error);
