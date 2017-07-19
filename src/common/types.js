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

export type ConfigT = {
  srcPaths: Array<string>,
  srcExtensions: Array<string>,
  langs: Array<string>,
  msgFunctionNames: Array<string>,
  msgRegexps: Array<string>,
  fMinify: boolean,
  fJsOutput: boolean,
  fJsonOutput: boolean,
  fReactIntlOutput: boolean,
};

export type InternalConfigT = ConfigT & {
  dbVersion: number,
};

interface NodeT {
  id: string,
}

type CoreKeyT = {
  isDeleted: boolean,
  context: ?string,
  text: string,
  unusedSince: ?string,
  sources: Array<string>,
};

export type KeyT = CoreKeyT & {
  id: string,
  firstUsed: string,
  description: ?string,
  translations: Object,
};

export type InternalKeyT = CoreKeyT & {
  id: string,
  firstUsed: ?string,
  reactIntlId?: string,
};

export type TranslationT = {
  id: string,
  isDeleted: boolean,
  lang: string,
  translation: string,
  fuzzy: ?boolean,
  keyId: string,
};

export type InternalTranslationT = TranslationT;

export type ViewerT = {
  id: string,
  config: ConfigT,
  keys: Object,
};
