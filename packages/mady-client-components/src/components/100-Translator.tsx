import React from 'react';
import { Icon, notify, notifDelete } from 'giu';
import axios from 'axios';
import type { Config, Key } from '../types';
import { localGet, localSet } from '../gral/localStorage';

const POLL_INTERVAL = 5e3;
const API_TIMEOUT = 20e3;

// ==============================================
// Declarations
// ==============================================
type Props = {
  scope?: string | null;
  allowPurge?: boolean;
  apiUrl: string;
};
type State = {
  sysConfig: Config | null;
  langs: string[] | null;
  fetching: boolean;
  keys: Key[];
  tUpdated: number | null;
};

// ==============================================
// Component
// ==============================================
class Translator extends React.Component<Props, State> {
  state = {
    sysConfig: null,
    langs: null,
    fetching: false,
    keys: [] as Key[],
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
    return (
      <div className="mady-translator">
        <h3>Config</h3>
        <div>{JSON.stringify(this.state.sysConfig)}</div>
        <h3>Langs: {this.state.langs}</h3>
        <h3>tUpdated: {this.state.tUpdated}</h3>
        <h3>Keys</h3>
        {this.state.keys.map((o) => (
          <div
            key={o.id}
          >{`${o.context} — ${o.text} --> ${o.translations.es?.translation}`}</div>
        ))}
      </div>
    );
  }

  // ==============================================
  fetchData = async ({ force }: { force?: boolean } = {}) => {
    if (this.state.fetching) return;

    // Fetch sysConfig
    if (!this.state.sysConfig) {
      const sysConfig = await this.fetchConfig();
      const langs = calcInitialLangs(sysConfig);
      this.setState({ sysConfig, langs });
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
      throw err;
    }
  };

  fetchTUpdated = async () => {
    try {
      const res = await this.api.get('/tUpdated');
      const { tUpdated } = res.data;
      return tUpdated as number;
    } catch (err) {
      notifDelete('tUpdateError');
      notify({
        id: 'tUpdateError',
        type: 'warn',
        icon: 'wifi',
        title: 'Having connectivity problems',
        msg: 'Please check your network',
      });
      return null;
    }
  };

  fetchTranslations = async () => {
    try {
      const { langs } = this.state;
      const { scope } = this.props;
      let url = `/keysAndTranslations/${langs}`;
      if (scope !== undefined) url += `?scope=${scope || ''}`;
      const res = await this.api.get(url);
      return res.data as { keys: Key[]; tUpdated: number };
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
}

// ==============================================
const calcInitialLangs = (sysConfig: Config) => {
  const sysLangs = sysConfig.langs;
  let langs = localGet('langs') as string[];
  if (langs == null) {
    langs = sysConfig.langs.filter((o) => o !== sysConfig.originalLang);
    if (!langs.length) langs = sysConfig.langs;
  }
  langs = langs.filter((o) => sysLangs.indexOf(o) >= 0);
  localSet('langs', langs);
  return langs;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==============================================
// Public
// ==============================================
export default Translator;
