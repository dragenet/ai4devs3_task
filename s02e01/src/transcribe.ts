import OpenAI from 'openai';

import { config } from './config/transcribe';
import {
  MAX_TRANSCRIPTION_FILE_SIZE,
  SUPPORTED_TRANSCRIPTION_FILE_EXTENSIONS,
} from './constants/defaultOpenAIModelsConfig';
import { FileService } from './services/file.service';
import { OpenAIService } from './services/openai.service';
import { TranscribeService } from './services/transcribe.service';
import type { FileInfo } from './types/FileInfo';

const isFileSupported = (file: FileInfo) => {
  switch (true) {
    case file.size > MAX_TRANSCRIPTION_FILE_SIZE:
      return { isSupported: false, reason: 'TOO BIG' };
    case !SUPPORTED_TRANSCRIPTION_FILE_EXTENSIONS.includes(file.extension):
      return { isSupported: false, reason: 'UNSUPPORTED EXTENSION' };
    default:
      return { isSupported: true, reason: 'OK' };
  }
};
const checkFoundFiles = (files: FileInfo[]) => {
  console.log('Found files:');
  files.forEach((file) => {
    const { isSupported, reason } = isFileSupported(file);
    console.log(`\t${reason} - ${file.fullName}`);
    if (!isSupported) throw new Error(`File ${file.fullName} is not supported`);
  });
};

const transcribeFiles = async (
  resourcesFiles: FileInfo[],
  transcribeService: TranscribeService,
  outputService: FileService,
) => {
  for await (const file of resourcesFiles) {
    await (async () => {
      console.log(`Transcribing ${file.fullName}...`);
      const { transcription, refinedTranscription } = await transcribeService.transcribeFile(
        file,
        true,
      );
      const transcriptionFileInfo = await outputService.saveFile(
        `raw/${file.name}.txt`,
        transcription,
      );
      const refinedTranscriptionFileInfo = await outputService.saveFile(
        `refined/${file.name}.txt`,
        refinedTranscription,
      );
      console.log(
        `Saved raw transcription to ${transcriptionFileInfo.relativePath} and refined to ${refinedTranscriptionFileInfo.relativePath}`,
      );
    })();
  }
};

const main = async () => {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });
  const resourcesService = new FileService(config.data.resources);
  const outputService = new FileService(config.data.transcriptions);
  const openAIService = new OpenAIService(openai);
  const transcribeService = new TranscribeService(resourcesService, openAIService);

  const resourcesFiles = await resourcesService.getFilesList();

  checkFoundFiles(resourcesFiles);
  await transcribeFiles(resourcesFiles, transcribeService, outputService);
};

main(); //.catch(console.error);
