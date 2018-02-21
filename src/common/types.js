// @flow

/* eslint-disable no-unused-vars, no-undef */

// ========================================
// Libraries
// ========================================
// ----------------------------------------
// Storyboard
// ----------------------------------------
import type { StoryT as _StoryT } from 'storyboard';

export type StoryT = _StoryT;

// ----------------------------------------
// Giu
// ----------------------------------------
export type HoverableProps = {
  hovering: ?boolean,
  onHoverStart: (ev: SyntheticMouseEvent) => void,
  onHoverStop: (ev: SyntheticMouseEvent) => void,
};

// ========================================
// Other
// ========================================
export type MapOf<T> = { [key: string]: T };
export type LocaleFunctionT = (data: any) => string;

// interface NodeT { id: string }

// ----------------------------------------
// Config
// ----------------------------------------
export type ConfigT = {
  srcPaths: Array<string>,
  srcExtensions: Array<string>,
  langs: Array<string>,
  originalLang: string,
  msgFunctionNames: Array<string>,
  msgRegexps: Array<string>,
  fMinify: boolean,
  fJsOutput: boolean,
  fJsonOutput: boolean,
  fReactIntlOutput: boolean,
};

// Used server-side
export type InternalConfigT = ConfigT & {
  dbVersion: number,
};

// ----------------------------------------
// Stats
// ----------------------------------------
export type StatsT = {
  numTotalKeys: number,
  numUsedKeys: number,
  numTranslations: Array<{ lang: string, value: number }>,
};

// Used server-side
export type InternalStatsT = StatsT;

// ----------------------------------------
// Key
// ----------------------------------------
type CoreKeyT = {
  isDeleted?: boolean,
  context: ?string,
  text: string,
  unusedSince: ?string,
  sources: Array<string>,
  isMarkdown?: boolean,
  scope?: string,
};

export type KeyT = CoreKeyT & {
  id: string,
  firstUsed: string,
  description: ?string,
  translations: Object,
};

// Used server-side
export type InternalKeyT = CoreKeyT & {
  id: string,
  firstUsed: ?string,
  reactIntlId?: string,
};

// ----------------------------------------
// Translation
// ----------------------------------------
export type TranslationT = {
  id: string,
  isDeleted: boolean,
  lang: string,
  translation: string,
  fuzzy: ?boolean,
  keyId: string,
};

// Used server-side
export type InternalTranslationT = TranslationT;

// ----------------------------------------
// Viewer
// ----------------------------------------
export type ViewerT = {
  id: string,
  config: ConfigT,
  stats: StatsT,
  keys: Object,
};
