import React from 'react';
import { LargeMessage, notify, notifDelete } from 'giu';
import { addLast } from 'timm';
import classnames from 'classnames';
import axios from 'axios';
import type { Config, Key, Keys } from '../types';
import { localGet, localSet } from '../gral/localStorage';
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
  tUpdated: number | null;
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
    tUpdated: null,
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
    return (
      <div
        className={classnames('mady-translator', {
          parsing,
          'full-height': this.props.height === 0,
        })}
      >
        <Toolbar onClickParse={this.onClickParse} />
        {this.renderTable()}
      </div>
    );
  }

  renderTable() {
    if (this.state.fatalError)
      return (
        <LargeMessage>
          The translation service is currently unavailable. Please try again
          later!
        </LargeMessage>
      );
    const { tUpdated, config, langs, keys, parsing } = this.state;
    if (tUpdated == null || config == null)
      return <LargeMessage>Loading data…</LargeMessage>;
    return (
      <TranslationTable
        config={config!}
        langs={langs}
        keys={keys}
        shownKeyIds={this.getShownKeyIds()}
        parsing={parsing}
        height={this.props.height}
        onAddLang={this.onAddLang}
        onRemoveLang={this.onRemoveLang}
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

  fetchData = async ({ force }: { force?: boolean } = {}) => {
    if (this.state.fetching || this.state.fatalError) return;
    this.setState({ fetching: true });

    try {
      // Fetch config
      if (!this.state.config) {
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
      const { keys, tUpdated } = await this.fetchTranslations();
      this.setState({ keys, tUpdated });
    } finally {
      this.setState({ fetching: false });
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
      const { keys: keysArr, tUpdated } = res.data;
      keysArr.sort(keyComparator);
      const keys: Keys = {};
      keysArr.forEach((key: Key) => (keys[key.id] = key));
      return { keys, tUpdated } as { keys: Keys; tUpdated: number };
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

  // ==============================================
  prevKeys!: Keys;
  prevShownKeyIds!: string[];
  getShownKeyIds = () => {
    const { keys } = this.state;
    if (keys != null && keys === this.prevKeys) {
      return this.prevShownKeyIds;
    }
    const shownKeyIds = Object.keys(keys);
    this.prevKeys = keys;
    this.prevShownKeyIds = shownKeyIds;
    return shownKeyIds;
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

// Sort keys by context > scope > seq > text > id
const keyComparator = (a: Key, b: Key) => {
  if (a == null || b == null) return 0;
  const aContext = a.context ? simplifyStringWithCache(a.context) : '';
  const bContext = b.context ? simplifyStringWithCache(b.context) : '';
  if (aContext !== bContext) return aContext < bContext ? -1 : +1;
  const aScope = a.scope ? simplifyStringWithCache(a.scope) : '';
  const bScope = b.scope ? simplifyStringWithCache(b.scope) : '';
  if (aScope !== bScope) return aScope < bScope ? -1 : +1;
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
