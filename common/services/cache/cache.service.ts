import { createHash } from 'crypto';
import { join, relative } from 'path';

import { FileService } from '../file';
import type {
  CacheableInput,
  CacheContent,
  CacheEntry,
  CacheEntryWithContent,
  CacheHash,
  CacheOptions,
} from './cache.types';

export class CacheService {
  private readonly cacheFileName: string;
  private readonly cacheFilesDir: string;
  private readonly cacheDir: string;
  private readonly fileService: FileService;
  private cache: Map<string, CacheEntry>;

  constructor(options: CacheOptions = {}) {
    this.cacheDir = options.cacheDir ?? '.cache';
    this.cacheFileName = options.cacheFileName ?? 'lock.json';
    this.cacheFilesDir = 'caches';
    this.fileService = new FileService(this.cacheDir);
    this.cache = new Map();
  }

  async init(): Promise<void> {
    try {
      await this.fileService.makeDir(this.cacheFilesDir);

      // Load cache entries from lock file
      const cacheFile = await this.fileService.readFile(this.cacheFileName);
      const content = await cacheFile.text();
      const entries = JSON.parse(content);
      this.cache = new Map(Object.entries(entries));

      await this.clearObsoleteCaches();
    } catch (error) {
      this.cache = new Map();
    }
  }

  async removeCacheEntry(hash: CacheHash): Promise<void>;
  async removeCacheEntry(input: CacheableInput): Promise<void>;
  async removeCacheEntry(key: string, operation?: string): Promise<void>;
  async removeCacheEntry(
    hashOrInputOrKey: CacheHash | CacheableInput | string,
    operation?: string,
  ): Promise<void> {
    try {
      if (typeof hashOrInputOrKey === 'string') {
        // Case 1: Direct hash (64 chars)
        if (hashOrInputOrKey.length === 64) {
          const hash = hashOrInputOrKey;
          await this.removeByHash(hash);
          return;
        }

        // Case 2: Cache key
        const cacheKey = this.getCacheEntryKey(hashOrInputOrKey, operation);
        const entry = this.cache.get(cacheKey);
        if (entry) {
          await this.removeByHash(entry.sourceHash);
          return;
        }
      }

      // Case 3: CacheableInput
      const hash = await this.calculateHash(hashOrInputOrKey as CacheableInput);
      await this.removeByHash(hash);
    } catch (error) {
      // Ignore if cache file doesn't exist
    }
  }

  private async removeByHash(hash: CacheHash): Promise<void> {
    // Remove cache file
    await this.fileService.deleteFile(join(this.cacheFilesDir, hash));

    // Find and remove entry from lock file
    for (const [key, entry] of this.cache.entries()) {
      if (entry.sourceHash === hash) {
        this.cache.delete(key);
      }
    }

    await this.persistCache();
  }

  async clearObsoleteCaches(): Promise<void> {
    const cacheFiles = await this.fileService.getFilesList(this.cacheFilesDir);
    const validHashes = new Set<string>();
    const obsoleteHashes = new Set<string>();

    // Verify all cache entries
    for (const [_, entry] of this.cache.entries()) {
      try {
        const currentHash = await this.calculateHash(entry.sourcePath);
        if (currentHash === entry.sourceHash) {
          validHashes.add(entry.sourceHash);
        } else {
          obsoleteHashes.add(entry.sourceHash);
        }
      } catch (error) {
        // Source file not found or not accessible
        obsoleteHashes.add(entry.sourceHash);
      }
    }

    // Remove invalid entries
    await Promise.all(Array.from(obsoleteHashes).map((hash) => this.removeCacheEntry(hash)));

    // Remove orphaned cache files
    await Promise.all(
      cacheFiles.map(async (file) => {
        if (!validHashes.has(file.name)) {
          await this.fileService.deleteFile(file.relativePath);
        }
      }),
    );
  }

  private async calculateHash(input: CacheableInput): Promise<string> {
    const path = this.getPath(input, this.cacheDir);
    const file = await this.fileService.readFile(path);
    const content = Buffer.from(await file.arrayBuffer());

    return createHash('sha256').update(content).digest('hex');
  }

  private async persistCache(): Promise<void> {
    await this.fileService.saveFile(this.cacheFileName, JSON.stringify(this.toJSON(), null, 2));
  }

  toJSON(): Record<string, CacheEntry> {
    return Object.fromEntries(this.cache);
  }

  async isCached(input: CacheableInput): Promise<boolean> {
    const hash = await this.calculateHash(input);
    const sourcePath = this.getPath(input);
    const entry = this.cache.get(sourcePath);
    return entry?.sourceHash === hash;
  }

  private getPath(input: CacheableInput, baseDir = process.cwd()): string {
    let absolutePath: string;

    if (typeof input === 'string') {
      absolutePath = join(process.cwd(), input);
    } else if ('absolutePath' in input) {
      absolutePath = input.absolutePath;
    } else {
      absolutePath = join(process.cwd(), this.cacheDir, this.cacheFilesDir, input.sourceHash);
    }

    return relative(baseDir, absolutePath);
  }

  async addCacheEntry(
    input: CacheableInput,
    content: CacheContent,
    operation?: string,
  ): Promise<CacheEntryWithContent> {
    const sourcePath = this.getPath(input);
    const cacheEntryKey = this.getCacheEntryKey(sourcePath, operation);
    const hash = await this.calculateHash(input);
    await this.fileService.saveFile(join(this.cacheFilesDir, hash), content);

    const entry: CacheEntry = {
      key: cacheEntryKey,
      sourcePath,
      sourceHash: hash,
      timestamp: Date.now(),
    };

    this.cache.set(cacheEntryKey, entry);
    await this.persistCache();

    return { ...entry, content };
  }

  private getCacheEntryKey(input: string, operation?: string): string {
    return [operation, input].filter(Boolean).join('_');
  }

  async getCacheEntry(
    input: CacheableInput,
    operation?: string,
  ): Promise<CacheEntryWithContent | null> {
    const sourcePath = this.getPath(input);
    const cacheEntryKey = this.getCacheEntryKey(sourcePath, operation);
    const entry = this.cache.get(cacheEntryKey);

    if (!entry) return null;

    try {
      const content = await this.fileService.readFile(join(this.cacheFilesDir, entry.sourceHash));
      return { ...entry, content: await content.text() };
    } catch (error) {
      return null;
    }
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
    await this.persistCache();
  }

  async withCachedEntry<T extends CacheContent>(
    input: CacheableInput,
    operation: string,
    fn: () => T | Promise<T>,
  ): Promise<CacheEntryWithContent> {
    const entry = await this.getCacheEntry(input, operation);

    if (entry) {
      console.info('Cache hit: ', entry.key);
      return entry;
    }

    const result = await fn();
    const cachedEntry = await this.addCacheEntry(input, result, operation);
    console.info('Cached: ', cachedEntry.key);
    return cachedEntry;
  }
}
