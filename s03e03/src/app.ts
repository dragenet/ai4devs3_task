import { OpenAIService } from 'common/services/openai';
import OpenAI from 'openai';

import { toolsConfig } from './config/tools';
import { AgentService } from './services/agent.service';

const question = `Which datacenters are managed by employees that are on holiday (is_active=0). Answer with datacenters ids only formatted as JSON array of strings.`;

const main = async () => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const agent = new AgentService(new OpenAIService(openai), toolsConfig);
  const response = await agent.run(question);
  console.log(response);
};

await main();
