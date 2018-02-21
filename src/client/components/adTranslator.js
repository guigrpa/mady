// @flow

/* eslint-env browser */
import timm from 'timm';
import React from 'react';
import Relay, { graphql } from 'react-relay';
import {
  flexItem,
  flexContainer,
  Icon,
  LargeMessage,
  floatReposition,
} from 'giu';
import type { ViewerT, KeyT } from '../../common/types';
import { cookieGet, cookieSet } from '../gral/storage';
import type { KeyFilter } from '../gral/types';
import { simplifyStringWithCache } from './helpers';
import {
  styleKeyCol,
  styleLangCol,
  TRANSLATOR_GUTTER,
} from './adTranslatorStyles';
import TranslatorHeader from './ecTranslatorHeader';
import TranslatorRow from './edTranslatorRow';

/* eslint-disable arrow-body-style */
const comparator = (a: string, b: string): number => {
  return a < b ? -1 : a > b ? 1 : 0;
};
/* eslint-enable arrow-body-style */
const keyComparator = (a: KeyT, b: KeyT) => {
  if (a == null || b == null) return 0;
  const aStr = `${a.context || ''}${a.text || ''}${a.id}`;
  const bStr = `${b.context || ''}${b.text || ''}${b.id}`;
  return comparator(
    simplifyStringWithCache(aStr),
    simplifyStringWithCache(bStr)
  );
};

// ==========================================
// Declarations
// ==========================================
type Props = {
  lang: string,
  selectedKeyId: ?string,
  changeSelectedKey: (keyId: ?string) => void,
  filter: KeyFilter,
  // Relay
  viewer: ViewerT,
};

const fragment = graphql`
  fragment adTranslator_viewer on Viewer {
    id
    config {
      langs
    }
    stats {
      ...ecTranslatorHeader_stats
    }
    keys(first: 100000) @connection(key: "Translator_viewer_keys") {
      edges {
        node {
          id
          isDeleted
          unusedSince
          context # for sorting
          text # for sorting
          translations(first: 100000)
            @connection(key: "Translator_viewer_translations") {
            edges {
              node {
                isDeleted
                lang
                fuzzy
              }
            }
          }
          ...edTranslatorRow_theKey
        }
      }
    }
  }
`;

// ==========================================
// Translator
// ==========================================
class Translator extends React.Component {
  props: Props;
  state: {
    langs: Array<string>,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      langs: this.readLangs(),
    };
  }

  // ==========================================
  render() {
    return (
      <div style={style.outer}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }

  renderHeader() {
    const { viewer } = this.props;
    return (
      <TranslatorHeader
        lang={this.props.lang}
        langs={this.state.langs}
        availableLangs={viewer.config.langs}
        stats={viewer.stats}
        onAddLang={this.onAddLang}
        onRemoveLang={this.onRemoveLang}
        onChangeLang={this.onChangeLang}
      />
    );
  }

  renderBody() {
    const keys = this.getKeys();
    return (
      <div className="tableBody" style={style.body} onScroll={floatReposition}>
        {keys.map(this.renderKeyRow)}
        {this.renderFillerRow()}
      </div>
    );
  }

  renderKeyRow = (key: KeyT) => {
    const fSelected = this.props.selectedKeyId === key.id;
    return (
      <TranslatorRow
        key={key.id}
        theKey={key}
        langs={this.state.langs}
        fSelected={fSelected}
        changeSelectedKey={this.props.changeSelectedKey}
        styleKeyCol={style.keyCol}
        styleLangCol={style.langCol}
        stats={this.props.viewer.stats}
      />
    );
  };

  renderFillerRow() {
    const noKeys =
      this.props.viewer.keys.edges.length > 0 ? (
        ''
      ) : (
        <LargeMessage>
          No messages. Click on <Icon icon="refresh" disabled /> to refresh
        </LargeMessage>
      );
    return (
      <div className="tableFillerRow" style={style.fillerRow}>
        <div style={style.keyCol}>{noKeys}</div>
        {this.state.langs.map(lang => <div key={lang} style={style.langCol} />)}
      </div>
    );
  }

  // ==========================================
  getKeys() {
    let keys = this.props.viewer.keys.edges
      .map(o => o.node)
      .filter(o => !o.isDeleted);
    const { filter } = this.props;
    const { langs } = this.state;
    if (filter === 'UNUSED') keys = keys.filter(o => !!o.unusedSince);
    if (filter === 'FUZZY') {
      const allKeys = keys;
      keys = [];
      for (let i = 0; i < allKeys.length; i++) {
        const key = allKeys[i];
        const translations = key.translations
          ? key.translations.edges.map(o => o.node).filter(o => !o.isDeleted)
          : [];
        for (let k = 0; k < translations.length; k++) {
          const translation = translations[k];
          if (langs.indexOf(translation.lang) < 0) continue;
          if (translation.fuzzy) {
            keys.push(key);
            break;
          }
        }
      }
    }
    if (filter === 'UNTRANSLATED') {
      const allKeys = keys;
      keys = [];
      for (let i = 0; i < allKeys.length; i++) {
        const key = allKeys[i];
        const translations = key.translations
          ? key.translations.edges.map(o => o.node).filter(o => !o.isDeleted)
          : [];
        for (let k = 0; k < langs.length; k++) {
          const lang = langs[k];
          const translation = translations.find(o => o.lang === lang);
          if (!translation) {
            keys.push(key);
            break;
          }
        }
      }
    }
    keys = keys.sort(keyComparator);
    return keys;
  }

  readLangs(): Array<string> {
    const availableLangs = this.props.viewer.config.langs;
    let langs = cookieGet('langs') || [];
    langs = langs.filter(o => availableLangs.indexOf(o) >= 0);
    if (!langs.length && availableLangs.length) langs.push(availableLangs[0]);
    this.writeLangs(langs);
    return langs;
  }

  writeLangs(langs: Array<string>) {
    cookieSet('langs', langs);
  }

  onAddLang = () => {
    const prevLangs = this.state.langs;
    const availableLangs = this.props.viewer.config.langs;
    const newLang = availableLangs.find(o => prevLangs.indexOf(o) < 0);
    if (newLang == null) return;
    const nextLangs = timm.addLast(prevLangs, newLang);
    this.updateLangs(nextLangs);
  };

  onRemoveLang = (ev: SyntheticEvent) => {
    if (!(ev.currentTarget instanceof HTMLElement)) return;
    this.removeLang(Number(ev.currentTarget.id));
  };
  removeLang(idx: number) {
    const nextLangs = timm.removeAt(this.state.langs, idx);
    this.updateLangs(nextLangs);
  }

  onChangeLang = (ev: SyntheticEvent, lang: string) => {
    const prevLangs = this.state.langs;
    if (!(ev.currentTarget instanceof HTMLElement)) return;
    const idx = Number(ev.currentTarget.id);
    let fFound = false;
    for (let i = 0; i < prevLangs.length; i++) {
      if (i === idx) continue;
      if (prevLangs[i] === lang) {
        fFound = true;
        break;
      }
    }
    if (fFound) {
      this.removeLang(idx);
      return;
    }
    const nextLangs = timm.replaceAt(this.state.langs, idx, lang);
    this.updateLangs(nextLangs);
  };

  updateLangs(langs: Array<string>) {
    this.writeLangs(langs);
    this.setState({ langs });
  }
}

// ==========================================
const style = {
  outer: flexItem(
    '1 0 10em',
    flexContainer('column', {
      marginTop: 5,
      marginRight: -TRANSLATOR_GUTTER,
    })
  ),
  body: flexItem(1, flexContainer('column', { overflowY: 'scroll' })),
  row: flexItem('none', flexContainer('row')),
  headerRow: {
    position: 'relative',
    fontWeight: 'bold',
  },
  fillerRow: flexItem('1 1 0px', flexContainer('row')),
  keyCol: styleKeyCol,
  langCol: styleLangCol,
};

// ==========================================
// Public
// ==========================================
const Container = Relay.createFragmentContainer(Translator, fragment);
export default Container;
export { Translator as _Translator };
