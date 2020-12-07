export type Config = {
  srcPaths: Array<string>;
  srcExtensions: Array<string>;
  langs: Array<string>;
  originalLang: string;
  msgFunctionNames: Array<string>;
  msgRegexps: Array<string>;
  fMinify: boolean;
  fJsOutput: boolean;
};

export type Key = {
  id: string;
  isDeleted?: boolean;
  // Main contents
  context?: string | null;
  text: string;
  isMarkdown?: boolean;
  // Classification
  scope?: string;
  // Message group
  seq?: number;
  // Usage
  firstUsed?: string | null;
  unusedSince?: string | null;
  sources: string[];
};
export type Keys = Record<string, Key>;

export type Translation = {
  id: string;
  isDeleted?: boolean;
  keyId: string;
  lang: string;
  translation: string;
  fuzzy?: boolean;
};
type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
export type TranslationWithoutKeyId = Without<Translation, 'keyId'>;
export type Translations = Record<string, Translation>;
