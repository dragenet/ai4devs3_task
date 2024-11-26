import type { CacheService } from 'common/services/cache';
import type { FileInfo, FileService } from 'common/services/file';
import type { OpenAIService } from 'common/services/openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { z } from 'zod';

import { reportKeywordsPrompt } from '../prompts/getReportKeywords.prompt';
import { extractPeopleFromText } from './common';

export const getPeopleForReports = async (
  reportsFiles: FileInfo[],
  fileService: FileService,
  cacheService: CacheService,
  openaiService: OpenAIService,
) => {
  const reportsPeople = await Promise.all(
    reportsFiles.map(async (file): Promise<string[]> => {
      const filecontent = await fileService.readFile(file.relativePath).then((file) => file.text());

      const peopleList = await cacheService
        .withCachedEntry(file, 'report-people', async () =>
          extractPeopleFromText(filecontent, openaiService),
        )
        .then((res) => res.content);

      if (peopleList === 'NO_PEOPLE_FOUND') {
        return [];
      }

      return peopleList.split(',').map((person: string) => person.trim());
    }),
  );

  return reportsPeople.reduce(
    (acc: Record<string, string[]>, people, index) => ({
      ...acc,
      [reportsFiles[index].fullName]: people,
    }),
    {},
  );
};

export const parseReportFileName = (file: FileInfo) => {
  const [date, rest, sektorPart] = file.name.split('_');
  const reportPart = rest.replace('-sektor_', '');
  const reportNum = reportPart.replace('report-', '');

  return {
    date,
    title: `Report ${reportNum}`,
    sector: sektorPart,
  };
};

const reportKeywordsSchema = z.object({
  _thoughts: z.string(),
  keywords: z.array(z.string()),
});

export const extractReportKeywords = async (
  report: string,
  openaiService: OpenAIService,
  facts?: string[],
) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: reportKeywordsPrompt(facts),
    },
    {
      role: 'user',
      content: report,
    },
  ];

  const response = await openaiService.complete(messages, {
    json: true,
    model: 'gpt-4o-mini',
  });

  return reportKeywordsSchema.parse(JSON.parse(response));
};

export const getReportKeywords = async (
  file: FileInfo,
  peopleFactsLookUp: Record<string, FileInfo[]>,
  reportPeople: string[],
  factsKeywords: Record<string, string[]>,
  fileService: FileService,
  openaiService: OpenAIService,
) => {
  const filecontent = await fileService.readFile(file.relativePath).then((file) => file.text());

  const factsFiles = reportPeople.flatMap((person) => peopleFactsLookUp[person]);

  const facts = await Promise.all(
    factsFiles.map(async (file) =>
      fileService.readFile(file.relativePath).then((file) => file.text()),
    ),
  );

  const relatedFactsKeywords = factsFiles.flatMap((fact) => factsKeywords[fact.fullName]);

  const metadata = parseReportFileName(file);

  const reportWithMetadata = `
      sektor: ${metadata.sector}
      data: ${metadata.date}
      ${filecontent}
`;

  const textKeywords = await extractReportKeywords(reportWithMetadata, openaiService, facts);
  return Array.from(new Set([...textKeywords.keywords, ...relatedFactsKeywords]));
};

export const getReportsKeywords = async (
  reports: FileInfo[],
  peopleFactsLookUp: Record<string, FileInfo[]>,
  reportPeople: Record<string, string[]>,
  factsKeywords: Record<string, string[]>,
  fileService: FileService,
  openaiService: OpenAIService,
) => {
  const reportsKeywords = await Promise.all(
    reports.map((report) =>
      getReportKeywords(
        report,
        peopleFactsLookUp,
        reportPeople[report.fullName],
        factsKeywords,
        fileService,
        openaiService,
      ),
    ),
  );

  return reportsKeywords.reduce((acc: Record<string, string[]>, keywords, index) => {
    acc[reports[index].fullName] = keywords.map((keyword) => keyword.trim());
    return acc;
  }, {});
};
