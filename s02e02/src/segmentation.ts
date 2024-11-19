import Replicate from 'replicate';
import sharp from 'sharp';

import { config } from './config/segmentation';
import { FileService } from './services/file.service';

const MAPS_IMAGE_PATH = 'resources/maps.png';
const OUTPUT_BASE_PATH = 'maps';

const fileService = new FileService();
const replicate = new Replicate({
  auth: config.replicate.apiKey,
});

const mapsImage = await fileService.readFile(MAPS_IMAGE_PATH);

const input = {
  image: mapsImage,
  query: 'maps',
  box_threshold: 0.4,
  text_threshold: 0.2,
};

const replicateOutput = (await replicate.run(
  'adirik/grounding-dino:efd10a8ddc57ea28773327e881ce95e20cc1d734c589f7dd01d2036921ed78aa',
  {
    input,
  },
)) as { detections: { bbox: number[] }[] };

await fileService.makeDir(OUTPUT_BASE_PATH);

let segmentNumber = 0;
for (const segment of replicateOutput.detections) {
  const boundingBox = segment.bbox;
  const width = boundingBox[2] - boundingBox[0];
  const height = boundingBox[3] - boundingBox[1];

  await sharp(MAPS_IMAGE_PATH)
    .extract({
      left: boundingBox[0],
      top: boundingBox[1],
      width,
      height,
    })
    .toFile(`${OUTPUT_BASE_PATH}/${segmentNumber}.png`);

  segmentNumber++;
}
