import { CacheService } from 'common/services/cache';
import { type FileInfo, FileService } from 'common/services/file';
import { HttpService } from 'common/services/http';
import { OpenAIService } from 'common/services/openai';
import OpenAI from 'openai';

import { categorizeFactsByPeople, filterAvailableFacts, getFactsKeywords } from './utils/facts';
import { getPeopleForReports, getReportsKeywords } from './utils/reports';

const RESOURCES_PATH = './resources';
const FACTS_PATH = './facts';
const API_URL = 'https://centrala.ag3nts.org/report';

enum SUPPORTED_FILE_EXTENSIONS {
  TXT = 'txt',
}

const getReportsByType = (files: FileInfo[], type: SUPPORTED_FILE_EXTENSIONS) =>
  files.filter((file) => file.extension === type);

const main = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const resourcesService = new FileService(RESOURCES_PATH);
  const openaiService = new OpenAIService(openai);
  const httpService = new HttpService();
  const cacheService = new CacheService();
  await cacheService.init();

  const reportFiles = await resourcesService.getFilesList();

  const factsFiles = await resourcesService.getFilesList(FACTS_PATH);

  const contentfullFactsFiles = await filterAvailableFacts(factsFiles, resourcesService);
  const textReportsFiles = getReportsByType(reportFiles, SUPPORTED_FILE_EXTENSIONS.TXT);

  const peopleFactsLookUp = await categorizeFactsByPeople(
    contentfullFactsFiles,
    resourcesService,
    openaiService,
    cacheService,
  );

  const reportsPeopleLookUp = await getPeopleForReports(
    textReportsFiles,
    resourcesService,
    cacheService,
    openaiService,
  );

  const factsKeywords = await getFactsKeywords(
    contentfullFactsFiles,
    openaiService,
    resourcesService,
  );

  const reportsKeywords = await getReportsKeywords(
    textReportsFiles,
    peopleFactsLookUp,
    reportsPeopleLookUp,
    factsKeywords,
    resourcesService,
    openaiService,
  );

  const data = {
    apikey: process.env.API_KEY,
    task: 'dokumenty',
    answer: Object.entries(reportsKeywords).reduce((acc: Record<string, string>, [key, value]) => {
      acc[key] = value.join(', ');
      return acc;
    }, {}),
  };

  const response = await httpService.post(API_URL, data).then((res) => res.json());
  console.log('response: ', response);
};

main();
