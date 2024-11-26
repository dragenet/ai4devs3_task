import type { CacheService } from 'common/services/cache';
import type { FileInfo, FileService } from 'common/services/file';
import type { OpenAIService } from 'common/services/openai';

import { extractPeopleFromText } from './common';
import { extractReportKeywords } from './reports';

export const filterAvailableFacts = async (factsFiles: FileInfo[], fileService: FileService) => {
  const factFilesContent = await Promise.all(
    factsFiles.map((file) => fileService.readFile(file.relativePath).then((file) => file.text())),
  );

  return factsFiles.filter((_, index) => !factFilesContent[index].startsWith('entry deleted'));
};

export const categorizeFactsByPeople = async (
  factsFiles: FileInfo[],
  fileService: FileService,
  openaiService: OpenAIService,
  cacheService: CacheService,
) => {
  const factsPeople = await Promise.all(
    factsFiles.map(async (file): Promise<string[]> => {
      const filecontent = await fileService.readFile(file.relativePath).then((file) => file.text());

      const peopleList = await cacheService
        .withCachedEntry(file, 'fact-people', async () =>
          extractPeopleFromText(filecontent, openaiService),
        )
        .then((res) => res.content);

      return peopleList.split(',').map((person: string) => person.trim());
    }),
  );

  const availablePeople = Array.from(new Set(factsPeople.flat()));

  return availablePeople.reduce((acc: Record<string, FileInfo[]>, person) => {
    acc[person] = factsFiles.filter((_, index) => factsPeople[index].includes(person));
    return acc;
  }, {});
};

export const getFactsKeywords = async (
  facts: FileInfo[],
  openaiService: OpenAIService,
  fileService: FileService,
) => {
  const factsKeywords = await Promise.all(
    facts.map(async (fact) => {
      const fileContent = await fileService.readFile(fact.relativePath).then((file) => file.text());
      return extractReportKeywords(fileContent, openaiService);
    }),
  );

  return facts.reduce((acc: Record<string, string[]>, fact, index) => {
    acc[fact.fullName] = factsKeywords[index].keywords;
    return acc;
  }, {});
};
