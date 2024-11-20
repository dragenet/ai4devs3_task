import { CacheService } from 'common/services/cache';
import { type FileInfo, FileService } from 'common/services/file';
import { HttpService } from 'common/services/http';
import { OpenAIService } from 'common/services/openai';
import OpenAI from 'openai';

import { ClassifyService } from './services/classify.service';
import { ImageService } from './services/image.service';
import { TranscriptionService } from './services/transcription.service';

const REPORTS_PATH = './resources';
const API_URL = 'https://centrala.ag3nts.org/report';

enum SUPPORTED_FILE_EXTENSIONS {
  TXT = 'txt',
  MP3 = 'mp3',
  PNG = 'png',
}

const getReportsByType = (files: FileInfo[], type: SUPPORTED_FILE_EXTENSIONS) =>
  files.filter((file) => file.extension === type);

const reduceReports = async <T>(files: FileInfo[], fn: (files: FileInfo[]) => Promise<T[]>) => {
  const result = await fn(files);
  return result.reduce((acc, value, index) => ({ ...acc, [files[index].fullName]: value }), {});
};

const filterReportsByCategory = (reports: Record<string, string>, category: string) =>
  Object.entries(reports)
    .filter(([_, value]) => value === category)
    .map(([key]) => key);

const main = async () => {
  if (!process.env.OPENAI_API_KEY || !process.env.API_KEY) {
    throw new Error('Environment variables are missing');
  }

  const fileService = new FileService();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const openaiService = new OpenAIService(openai);
  const cacheService = new CacheService();
  const classifyService = new ClassifyService(openaiService);
  const apiService = new HttpService(undefined, process.env.API_KEY);
  await cacheService.init();

  const transcriptionService = new TranscriptionService(openaiService, fileService, cacheService);
  const imageService = new ImageService(openaiService, fileService, cacheService);

  const reportFiles = await fileService.getFilesList(REPORTS_PATH);

  const textReportFiles = getReportsByType(reportFiles, SUPPORTED_FILE_EXTENSIONS.TXT);
  const audioReportFiles = getReportsByType(reportFiles, SUPPORTED_FILE_EXTENSIONS.MP3);
  const imageReportFiles = getReportsByType(reportFiles, SUPPORTED_FILE_EXTENSIONS.PNG);

  console.log('Loading text reports...');
  const textReports = await reduceReports(textReportFiles, async (files) =>
    Promise.all(files.map((file) => fileService.readFile(file.relativePath).then((t) => t.text()))),
  );

  console.log('Transcribing audio reports...');
  const reportsTranscriptions = await reduceReports(
    audioReportFiles,
    async (files) =>
      await Promise.all(
        files.map((file) => transcriptionService.transcribe(file).then((t) => t.content)),
      ),
  );

  console.log('OCR report images...');
  const imageTextReports = await reduceReports(
    imageReportFiles,
    async (files) =>
      await Promise.all(files.map((file) => imageService.extractText(file).then((t) => t.content))),
  );

  const allReports: Record<string, string> = {
    ...textReports,
    ...reportsTranscriptions,
    ...imageTextReports,
  };

  console.log('Classifying reports...');
  const reportCategories = await Promise.all(
    Object.values(allReports).map((report) => classifyService.classify(report)),
  ).then((results) => {
    const files = Object.keys(allReports);
    return results.reduce((acc, value, index) => ({ ...acc, [files[index]]: value.category }), {});
  });

  const reportsAboutHardware = filterReportsByCategory(reportCategories, 'hardware').sort();
  const reportsAboutPeople = filterReportsByCategory(reportCategories, 'people').sort();

  console.log('hardware: ', reportsAboutHardware);
  console.log('people: ', reportsAboutPeople);

  const answerRequest = {
    task: 'kategorie',
    answer: {
      people: reportsAboutPeople,
      hardware: reportsAboutHardware,
    },
  };

  const response = await apiService.post(API_URL, answerRequest).then((r) => r.json());

  console.log('Response: ', response);
};

await main();
