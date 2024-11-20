import type { FileInfo } from '../file/file.types';

export interface CacheEntry {
  key: string;
  sourcePath: string;
  sourceHash: string;
  timestamp: number;
}

export interface CacheEntryWithContent extends CacheEntry {
  content: CacheContent;
}

export interface CacheOptions {
  cacheDir?: string;
  cacheFileName?: string;
}

export type CacheableInput = string | FileInfo | CacheEntry;
export type CacheContent = string;
export type CacheHash = string;
