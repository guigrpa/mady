// @flow

// ========================================
// Relay interoperability
// ========================================
interface _RelayContainer<DefaultProps, Props, State> extends React$Component<DefaultProps, Props, State> {
  // TODO: Due to bugs in Flow's handling of React.createClass, some fields
  // already declared in the base class need to be redeclared below. Ideally
  // they should simply be inherited.
  static defaultProps: $Abstract<DefaultProps>;
  props: Props;
  state: $Abstract<State>;

  // Bonus tracks added by Relay...
  static getFragment(...args: any): any;
};

export type RelayContainer<DefaultProps, Props, State> =
  Class<_RelayContainer<DefaultProps, Props, State>>;

// ========================================
// Giu
// ========================================
export type HoverableProps = {
  hovering: ?boolean,
  onHoverStart: (ev: Object) => void,
  onHoverStop: (ev: Object) => void,
};

// ========================================
// Other
// ========================================
export type Config = {
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

interface Node {
  id: string;
};

export type Key = {
  id: string,
  context: ?string,
  text: string,
  description: ?string,
  firstUsed: string,
  unusedSince: ?string,
  sources: Array<string>,
  translations: Object,
};

export type TranslationT = {
  id: string,
  lang: string,
  translation: string,
  keyId: string,
};

export type Viewer = {
  id: string,
  config: Config,
  anyNode: Key,
  keys: Object,
};
