export interface MinimalDocMetadata {
  tokens: number;
  headers: DocHeaders;
  urls: string[];
  images: string[];
}

export type DocMetadata = Record<string, any> & MinimalDocMetadata;

export interface IDoc {
  text: string;
  metadata: DocMetadata;
}

export interface DocHeaders {
  [key: string]: string[];
}
