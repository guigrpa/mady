// @flow

/* eslint-disable no-unused-vars, no-undef */

// ========================================
// Libraries
// ========================================
// ----------------------------------------
// Relay
// ----------------------------------------
class _RelayContainer<DefaultProps, Props, State>
extends React$Component<DefaultProps, Props, State> {
  // TODO: Due to bugs in Flow's handling of React.createClass, some fields
  // already declared in the base class need to be redeclared below. Ideally
  // they should simply be inherited.
  static defaultProps: $Abstract<DefaultProps>;
  props: Props;
  state: $Abstract<State>;

  // Bonus tracks added by Relay...
  static getFragment(name: string): any {}
}

export type RelayContainer<DefaultProps, Props, State> =
  Class<_RelayContainer<DefaultProps, Props, State>>;

// ----------------------------------------
// Giu
// ----------------------------------------
export type HoverablePropsT = {
  hovering: ?boolean,
  onHoverStart: (ev: Event) => void,
  onHoverStop: (ev: Event) => void,
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
  id: string;
}

type CoreKeyT = {
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
  lang: string,
  translation: string,
  keyId: string,
};

export type InternalTranslationT = TranslationT;

export type ViewerT = {
  id: string,
  config: ConfigT,
  anyNode: KeyT,
  keys: Object,
};
