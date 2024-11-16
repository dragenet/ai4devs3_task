import OpenAI from 'openai';
import path from 'path';

import { config } from './config/app';
import { AnswerService } from './services/answer.service';
import { FileService } from './services/file.service';
import { HttpService } from './services/http.service';
import { KeywordsService } from './services/keywords.service';
import { OpenAIService } from './services/openai.service';
import { QuestionTransformService } from './services/questionTransform.service';
import { SummarizeService } from './services/summarize.service';

const question =
  'Na jakiej ulicy znajdował się wydział uczelni na którym wykładał profesor Andrzej Maj?';

const main = async () => {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });
  const openAIService = new OpenAIService(openai);
  const fileService = new FileService(path.join(config.data.transcriptions, 'refined'));
  const answerService = new AnswerService(openAIService);
  const summarizeService = new SummarizeService(openAIService);
  const keywordsService = new KeywordsService(openAIService);
  const httpService = new HttpService(config.api.baseUrl, config.api.key);
  const questionTransformService = new QuestionTransformService(openAIService);
  const files = await fileService.getFilesList();

  const transcriptions = await Promise.all(
    files.map(async (file) => fileService.readFile(file.fullName).then((file) => file.text())),
  );

  const questionKeywords = await keywordsService.extractKeywords(question);
  console.log('Question keywords: ', questionKeywords.response);

  const summary = await summarizeService.summarize(transcriptions, questionKeywords.response);
  console.log('Transcriptions summary: ', summary.result);

  const transformedQuestion = await questionTransformService.transform(question, summary.result);

  console.log('Transformed question: ', transformedQuestion.question);

  const answer = await answerService.answer(transformedQuestion.question, summary.result);

  console.log('Answer: ', answer.answer);

  const reponse = {
    task: 'mp3',
    answer: answer.answer,
  };

  const apiResponse = await httpService.post(config.api.upload, reponse);

  console.log(apiResponse);
};

main().catch(console.error);
