import { FileService } from 'common/services/file';
import { DEFAULT_OPENAI_COMPLETION_MODEL_CONFIG, OpenAIService } from 'common/services/openai';
import { TextSplitterService } from 'common/services/textSplitter';
import { VectorService } from 'common/services/vector';
import OpenAI from 'openai';

const RESOURCES_PATH = './resources';
const MODEL = DEFAULT_OPENAI_COMPLETION_MODEL_CONFIG.model;

const normalizeDate = (date: string) => date.replaceAll('_', '-');

const main = async () => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const openaiService = new OpenAIService(openai);
  const resourcesService = new FileService(RESOURCES_PATH);
  const textSplitterService = new TextSplitterService();
  await textSplitterService.initializeTokenizer(MODEL);
  const vectorService = new VectorService(openaiService);

  const resourceFiles = await resourcesService.getFilesList();

  const docs = await Promise.all(
    resourceFiles.flatMap(async (file) => {
      const fileContent = await resourcesService
        .readFile(file.absolutePath)
        .then((content) => content.text());

      const contentChunks = fileContent.split('\n\n');

      return await Promise.all(
        contentChunks.map((contentChunk) =>
          textSplitterService.document(contentChunk, MODEL, {
            date: normalizeDate(file.name),
          }),
        ),
      );
    }),
  ).then((docs) => docs.flat());

  await vectorService.initializeCollectionWithData('docs', docs);
};

main();
