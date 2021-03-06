import React from 'react';
import { LargeMessage, notify, notifDelete } from 'giu';
import { merge, addLast, omit, updateIn, setIn, mergeIn } from 'timm';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import axios from 'axios';
import type { Config, Key, Keys, Translation } from '../types';
import { localGet, localSet } from '../gral/localStorage';
import { UNSCOPED } from '../gral/constants';
import { simplifyStringWithCache } from '../gral/helpers';
import TranslationTable from './110-TranslationTable';
import Toolbar from './105-Toolbar';

const POLL_INTERVAL = 5e3;
const API_TIMEOUT = 20e3;

// ==============================================
// Declarations
// ==============================================
type Props = {
  scope?: string | null;
  apiUrl: string;
  height: number /* table content height in pixels (-1 sets it to unlimited; 0 expands it to use the full viewport) */;
};
type State = {
  config: Config | null;
  langs: string[];
  fetching: boolean;
  parsing: boolean;
  fatalError: boolean;
  keys: Keys;
  scope: string | undefined;
  filter: string;
  tUpdated: number | null;
  selectedKeyId: string | null;
  quickFind: string;
};

// ==============================================
// Component
// ==============================================
class Translator extends React.Component<Props, State> {
  state: State = {
    config: null,
    langs: [] as string[],
    fetching: false,
    parsing: false,
    fatalError: false,
    keys: {} as Keys,
    scope: this.props.scope === null ? UNSCOPED : this.props.scope,
    filter: 'ALL' as string,
    tUpdated: null,
    selectedKeyId: null,
    quickFind: '',
  };
  pollInterval!: number;
  api = axios.create({ baseURL: this.props.apiUrl, timeout: API_TIMEOUT });

  componentDidMount() {
    this.fetchData();
    this.pollInterval = setInterval(this.fetchData, POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval);
  }

  // ==============================================
  render() {
    const { parsing } = this.state;
    const { keys, allScopes } = this.processData();
    return (
      <div
        className={classnames('mady-translator', {
          parsing,
          'full-height': this.props.height === 0,
        })}
      >
        {this.renderToolbar(allScopes)}
        {this.renderTable(keys, allScopes)}
      </div>
    );
  }

  renderToolbar(allScopes: string[]) {
    return (
      <Toolbar
        quickFind={this.state.quickFind}
        showScopeMenu={this.props.scope === undefined}
        scopes={allScopes}
        scope={this.state.scope}
        filter={this.state.filter}
        onClickParse={this.onClickParse}
        onClickDeleteUnused={this.onClickDeleteUnused}
        onChangeQuickFind={(quickFind: string) => this.setState({ quickFind })}
        onChangeScope={(scope: string | undefined) => this.setState({ scope })}
        onChangeFilter={(filter: string) => this.setState({ filter })}
      />
    );
  }

  renderTable(keys: Keys, allScopes: string[]) {
    if (this.state.fatalError)
      return (
        <LargeMessage>
          The translation service is currently unavailable. Please try again
          later!
        </LargeMessage>
      );
    const { tUpdated, config, langs, parsing } = this.state;
    if (tUpdated == null || config == null)
      return <LargeMessage>Loading data…</LargeMessage>;
    const shownKeyIds = Object.keys(keys);
    return (
      <TranslationTable
        config={config!}
        langs={langs}
        keys={keys}
        shownKeyIds={shownKeyIds}
        scopes={allScopes}
        selectedKeyId={this.state.selectedKeyId}
        parsing={parsing}
        height={this.props.height}
        onAddLang={this.onAddLang}
        onRemoveLang={this.onRemoveLang}
        onSelectKey={this.onSelectKey}
        onDeleteKey={this.onDeleteKey}
        onDeleteTranslation={this.onDeleteTranslation}
        onUpdateTranslation={this.onUpdateTranslation}
        onCreateTranslation={this.onCreateTranslation}
        autoTranslate={this.autoTranslate}
      />
    );
  }

  // ==============================================
  onClickParse = async () => {
    try {
      this.setState({ parsing: true });
      await this.api.get('/parse');
      await this.fetchData();
    } catch (err) {
      notify({
        type: 'error',
        icon: 'code',
        title: 'Parse failed',
        msg: 'Check the console...',
      });
      throw err;
    } finally {
      this.setState({ parsing: false });
    }
  };

  onClickDeleteUnused = async () => {
    try {
      await this.api.get('/deleteUnused');
      await this.fetchData();
    } catch (err) {
      notify({
        type: 'error',
        icon: 'code',
        title: 'Delete unused failed',
        msg: 'Check the console...',
      });
      throw err;
    }
  };

  onAddLang = (lang: string) => {
    const langs = addLast(this.state.langs, lang);
    localSet('langs', langs);
    this.setState({ langs }, () => this.fetchData({ force: true }));
  };

  onRemoveLang = (lang: string) => {
    const langs = this.state.langs.filter((o) => o !== lang);
    localSet('langs', langs);
    this.setState({ langs });
  };

  onSelectKey = (selectedKeyId: string) => {
    this.setState({ selectedKeyId });
  };

  onDeleteKey = async (id: string) => {
    const { keys } = this.state;
    if (!keys[id]) throw new Error(`Cannot delete key (not found): ${id}`);
    this.mutateData({
      optimisticState: { keys: omit(keys, id) },
      description: 'Delete message',
      url: `/key/${id}`,
      method: 'patch',
      body: { isDeleted: true },
      icon: 'times',
    });
  };

  onDeleteTranslation = async (keyId: string, lang: string) => {
    const { keys } = this.state;
    const key = keys[keyId];
    if (!key)
      throw new Error(`Cannot delete translation (key not found): ${keyId}`);
    const translation = key.translations[lang];
    if (!translation)
      throw new Error(
        `Cannot delete translation (translation for ${lang} not found): ${keyId}`
      );
    const { id } = translation;
    this.mutateData({
      optimisticState: {
        keys: updateIn(keys, [keyId, 'translations'], (o) =>
          omit(o, lang)
        ) as Keys,
      },
      description: 'Delete translation',
      url: `/translation/${id}`,
      method: 'patch',
      body: { isDeleted: true },
      icon: 'times',
    });
  };

  onUpdateTranslation = async (
    keyId: string,
    lang: string,
    updates: Partial<Translation>
  ) => {
    const { keys } = this.state;
    const key = keys[keyId];
    if (!key)
      throw new Error(`Cannot update translation (key not found): ${keyId}`);
    const translation = key.translations[lang];
    if (!translation)
      throw new Error(
        `Cannot update translation (translation for ${lang} not found): ${keyId}`
      );
    const { id } = translation;
    this.mutateData({
      optimisticState: {
        keys: mergeIn(keys, [keyId, 'translations', lang], updates) as Keys,
      },
      description: 'Update translation',
      url: `/translation/${id}`,
      method: 'patch',
      body: updates,
      icon: 'pencil-alt',
    });
  };

  onCreateTranslation = async (keyId: string, lang: string, text: string) => {
    const { keys } = this.state;
    const key = keys[keyId];
    if (!key)
      throw new Error(`Cannot create translation (key not found): ${keyId}`);
    const translation = {
      id: uuidv4(),
      lang,
      translation: text,
      keyId,
    };
    this.mutateData({
      optimisticState: {
        keys: setIn(keys, [keyId, 'translations', lang], translation) as Keys,
      },
      description: 'Create translation',
      url: `/translation`,
      method: 'post',
      body: translation,
      icon: 'pencil-alt',
    });
  };

  // ==============================================
  fetchData = async ({ force }: { force?: boolean } = {}) => {
    if (this.state.fetching || this.state.fatalError) return;

    try {
      // Fetch config
      if (!this.state.config) {
        this.setState({ fetching: true });
        const config = await this.fetchConfig();
        const langs = calcInitialLangs(config);
        this.setState({ config, langs });
        await delay(0); // make sure state has already been updated
      }

      // Fetch only update time, check it and bail out if
      // there's nothing new
      const curTUpdated = this.state.tUpdated;
      if (!force && curTUpdated != null) {
        const tUpdated = await this.fetchTUpdated();
        if (tUpdated == null) return;
        if (tUpdated <= curTUpdated) return;
      }

      // Fetch data
      if (!this.state.fetching) this.setState({ fetching: true });
      const { keys, tUpdated } = await this.fetchTranslations();
      this.setState({ keys, tUpdated });
    } finally {
      if (this.state.fetching) this.setState({ fetching: false });
    }
  };

  fetchConfig = async () => {
    try {
      const res = await this.api.get('/config');
      return res.data as Config;
    } catch (err) {
      notify({
        type: 'error',
        icon: 'language',
        title: "Could not fetch Mady's config",
        msg: 'Please try again later!',
      });
      this.setState({ fatalError: true });
      throw err;
    }
  };

  fetchTUpdated = async () => {
    try {
      const res = await this.api.get('/tUpdated');
      const { tUpdated } = res.data;
      notifDelete('tUpdateError');
      return tUpdated as number;
    } catch (err) {
      notifDelete('tUpdateError');
      notify({
        id: 'tUpdateError',
        type: 'warn',
        icon: 'wifi',
        title: 'Having connectivity problems',
        msg: 'Please check your network!',
      });
      return null;
    }
  };

  fetchTranslations = async () => {
    try {
      const { langs, config } = this.state;
      const { scope } = this.props;
      const langParam = langs.join(',') || config!.originalLang;
      let url = `/keysAndTranslations/${langParam}`;
      if (scope !== undefined) url += `?scope=${scope || ''}`;
      const res = await this.api.get(url);
      const keysArr = res.data.keys as Key[];
      const tUpdated = res.data.tUpdated as number;

      // Prepare keys
      keysArr.sort(keyComparator);
      const keys: Keys = {};
      keysArr.forEach((key) => {
        if (key.scope == null) key.scope = UNSCOPED;
        keys[key.id] = key;
      });
      return { keys, tUpdated };
    } catch (err) {
      notify({
        type: 'error',
        icon: 'comment',
        iconFamily: 'far',
        title: 'Could not fetch translations',
        msg: 'Please try again later!',
      });
      throw err;
    }
  };

  autoTranslate = async (lang: string, text: string) => {
    try {
      const res = await this.api.post('/autoTranslate', { lang, text });
      return res.data;
    } catch (err) {
      notify({
        type: 'error',
        icon: 'google',
        iconFamily: 'fab',
        title: 'Cannot autotranslate now',
        msg: 'Please try again later!',
      });
      return null;
    }
  };

  // Very simple and optimistic mutator (does not handle queues, etc -- a far cry
  // from GraphQL! But SIMPLE)
  mutateData = async (options: {
    optimisticState: Partial<State>;
    description: string;
    url: string;
    method: string;
    body?: any;
    icon?: string;
    iconFamily?: string;
  }) => {
    const { optimisticState, url, method } = options;
    const originalState = this.state;
    if (optimisticState) this.setState(optimisticState as State);
    try {
      const api: any = this.api;
      ['post', 'put', 'patch'].indexOf(method) >= 0
        ? await api[method](url, options.body)
        : await api[method](url);
    } catch (err) {
      this.setState(originalState);
      notify({
        type: 'error',
        icon: options.icon,
        iconFamily: options.iconFamily,
        title: `${options.description} failed`,
        msg: 'Please try again later!',
      });
    }
  };

  // ==============================================
  processData = () => {
    const targetScope = this.state.scope;
    const quickFind = simplifyStringWithCache(this.state.quickFind);
    const { langs, filter } = this.state;
    const keys0 = this.state.keys;
    const keys: Keys = {};
    const ids = Object.keys(keys0);
    let prevKey = null;
    const allScopesObj: Record<string, boolean> = {};
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let key = keys0[id];

      // Apply filters: scope, quick-find, filter
      const { scope } = key;
      allScopesObj[scope] = true;
      if (targetScope != null && scope !== targetScope) continue;
      if (quickFind && !this.matchesQuickFind(key, quickFind, langs)) continue;
      const shownTranslations = langs
        .map((lang) => key.translations[lang])
        .filter((o) => o != null && o.translation);
      const isUnused = key.unusedSince != null;
      const isTranslated = shownTranslations.length >= langs.length;
      const isFuzzy = shownTranslations.filter((o) => o.fuzzy).length > 0;
      if (filter === 'UNUSED' && !isUnused) continue;
      if (filter === 'FUZZY' && !isFuzzy) continue;
      if (filter === 'UNTRANSLATED' && isTranslated) continue;

      // Everything OK, add to list
      key = merge(key, {
        seqStarts:
          !prevKey ||
          !key.seq ||
          key.scope !== prevKey.scope ||
          key.context !== prevKey.context,
        isUnused,
        isTranslated,
        isFuzzy,
      });
      prevKey = key;
      keys[id] = key;
    }
    return { keys, allScopes: Object.keys(allScopesObj) };
  };

  matchesQuickFind = (key: Key, find: string, langs: string[]) => {
    const simplify = simplifyStringWithCache;
    if (key.scope && simplify(key.scope).indexOf(find) >= 0) return true;
    if (key.context && simplify(key.context).indexOf(find) >= 0) return true;
    if (key.text && simplify(key.text).indexOf(find) >= 0) return true;
    const { translations } = key;
    for (let i = 0; i < langs.length; i++) {
      const text = translations[langs[i]]?.translation;
      if (text && simplify(text).indexOf(find) >= 0) return true;
    }
    return false;
  };
}

// ==============================================
const calcInitialLangs = (config: Config) => {
  const sysLangs = config.langs;
  let langs = localGet('langs') as string[];
  if (langs == null) {
    langs = config.langs.filter((o) => o !== config.originalLang);
    if (!langs.length) langs = config.langs;
  }
  langs = langs.filter((o) => sysLangs.indexOf(o) >= 0);
  localSet('langs', langs);
  return langs;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Sort keys by scope > context > seq > text > id
const keyComparator = (a: Key, b: Key) => {
  if (a == null || b == null) return 0;
  const aScope = a.scope ? simplifyStringWithCache(a.scope) : '';
  const bScope = b.scope ? simplifyStringWithCache(b.scope) : '';
  if (aScope && !bScope) return -1;
  if (!aScope && bScope) return +1;
  if (aScope !== bScope) return aScope < bScope ? -1 : +1;
  const aContext = a.context ? simplifyStringWithCache(a.context) : '';
  const bContext = b.context ? simplifyStringWithCache(b.context) : '';
  if (aContext !== bContext) return aContext < bContext ? -1 : +1;
  const aSeq = a.seq;
  const bSeq = b.seq;
  if (aSeq != null && bSeq != null && aSeq !== bSeq) {
    return aSeq < bSeq ? -1 : +1;
  }
  const aText = a.text ? simplifyStringWithCache(a.text) : '';
  const bText = b.text ? simplifyStringWithCache(b.text) : '';
  if (aText !== bText) return aText < bText ? -1 : +1;
  return comparator(a.id, b.id);
};

const comparator = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

// ==============================================
// Public
// ==============================================
export default Translator;
