import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import type { ParsedPath } from 'node:path';
import { dirname, isAbsolute, join, parse, relative } from 'node:path';

import type { FileInfo } from './file.types';

export class FileService {
  public readonly basePath: string;

  constructor(basePath?: string) {
    // First set basePath to cwd as temporary value
    this.basePath = process.cwd();
    // Then resolve the provided path if any
    if (basePath) {
      this.basePath = this.resolvePath(basePath);
    }
  }

  /**
   * Resolves path considering both absolute and relative paths
   */
  public resolvePath(path: string): string {
    return isAbsolute(path) ? path : join(this.basePath, path);
  }

  /**
   * Gets list of files in directory with their details
   */
  async getFilesList(directory = ''): Promise<FileInfo[]> {
    const absolutePath = this.resolvePath(directory);
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
          extension: parsed.ext.slice(1),
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
    const absolutePath = this.resolvePath(path);
    const fileBuffer = await readFile(absolutePath);
    return new File([fileBuffer], path);
  }

  /**
   * Saves content to file, creates directories if needed
   * @returns FileInfo object about the freshly created file
   */
  async saveFile(path: string, content: string | Buffer): Promise<FileInfo> {
    const absolutePath = this.resolvePath(path);

    // Create directory structure if it doesn't exist
    await this.makeDir(dirname(absolutePath));

    await writeFile(absolutePath, content, 'utf-8');

    const parsed: ParsedPath = parse(path);
    const stats = await stat(absolutePath);

    return {
      relativePath: relative(this.basePath, absolutePath),
      absolutePath,
      fullName: path,
      name: parsed.name,
      extension: parsed.ext.slice(1),
      size: stats.size,
    };
  }

  async makeDir(path: string): Promise<void> {
    const absolutePath = this.resolvePath(path);
    await mkdir(absolutePath, { recursive: true });
  }

  /**
   * Deletes a file at the given path
   * @throws if file doesn't exist or cannot be deleted
   */
  async deleteFile(path: string): Promise<void> {
    const absolutePath = this.resolvePath(path);
    await unlink(absolutePath);
  }
}
