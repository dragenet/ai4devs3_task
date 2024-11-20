import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import type { ParsedPath } from 'node:path';
import { join, parse, relative, resolve } from 'node:path';
import { dirname } from 'node:path';

import type { FileInfo } from './file.types';

export class FileService {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath ? resolve(basePath) : process.cwd();
  }

  /**
   * Gets list of files in directory with their details
   */
  async getFilesList(directory = ''): Promise<FileInfo[]> {
    const absolutePath = join(this.basePath, directory);
    const files = await readdir(absolutePath);

    const fileInfos = await Promise.all(
      files.map(async (file) => {
        const filePath = join(absolutePath, file);
        const stats = await stat(filePath);

        if (!stats.isFile()) return null;

        const parsed: ParsedPath = parse(file);
        const relativePath = relative(this.basePath, filePath);

        return {
          relativePath,
          absolutePath: filePath,
          fullName: file,
          name: parsed.name,
          extension: parsed.ext.slice(1), // Remove the dot
          size: stats.size,
        };
      }),
    );

    return fileInfos.filter((info): info is FileInfo => info !== null);
  }

  /**
   * Reads file content
   */
  async readFile(path: string): Promise<File> {
    const absolutePath = join(this.basePath, path);
    const fileBuffer = await readFile(absolutePath);
    return new File([fileBuffer], path);
  }

  /**
   * Saves content to file, creates directories if needed
   * @returns FileInfo object about the freshly created file
   */
  async saveFile(path: string, content: string | Buffer): Promise<FileInfo> {
    const absolutePath = join(this.basePath, path);

    // Create directory structure if it doesn't exist
    this.makeDir(dirname(absolutePath));

    await writeFile(absolutePath, content, 'utf-8');

    const parsed: ParsedPath = parse(path);
    const stats = await stat(absolutePath); // Get file stats to retrieve size

    return {
      relativePath: relative(this.basePath, absolutePath),
      absolutePath,
      fullName: path,
      name: parsed.name,
      extension: parsed.ext.slice(1), // Remove the dot
      size: stats.size, // Size in bytes
    };
  }

  async makeDir(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
  }
}
