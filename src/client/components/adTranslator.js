// @flow

/* eslint-env browser */
import timm from 'timm';
import React from 'react';
import Relay, { graphql } from 'react-relay';
import filter from 'lodash/filter';
import { flexItem, flexContainer, Icon, LargeMessage } from 'giu';
import type { ViewerT, KeyT } from '../../common/types';
import { cookieGet, cookieSet } from '../gral/storage';
import { styleKeyCol, styleLangCol } from './adTranslatorStyles';
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
  return comparator(aStr, bStr);
};

// ==========================================
// Component declarations
// ==========================================
type Props = {
  lang: string,
  selectedKeyId: ?string,
  changeSelectedKey: (keyId: ?string) => void,
  // Relay
  viewer: ViewerT,
};

const fragment = graphql`
  fragment adTranslator_viewer on Viewer {
    id
    config {
      langs
    }
    keys(first: 100000) {
      edges {
        node {
          id
          isDeleted
          unusedSince
          context
          text # for sorting
          ...edTranslatorRow_theKey
        }
      }
    }
    ...ecTranslatorHeader_viewer
    ...edTranslatorRow_viewer
  }
`;

// ==========================================
// Component
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

  // ------------------------------------------
  // Render
  // ------------------------------------------
  render() {
    return (
      <div style={style.outer}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }

  renderHeader() {
    return (
      <TranslatorHeader
        lang={this.props.lang}
        langs={this.state.langs}
        viewer={this.props.viewer}
        onAddLang={this.onAddLang}
        onRemoveLang={this.onRemoveLang}
        onChangeLang={this.onChangeLang}
      />
    );
  }

  renderBody() {
    let keys = this.props.viewer.keys.edges.map(o => o.node);
    keys = keys.filter(o => !o.isDeleted).sort(keyComparator);
    return (
      <div className="tableBody" style={style.body}>
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
        viewer={this.props.viewer}
        langs={this.state.langs}
        fSelected={fSelected}
        changeSelectedKey={this.props.changeSelectedKey}
        styleKeyCol={style.keyCol}
        styleLangCol={style.langCol}
      />
    );
  };

  renderFillerRow() {
    const noKeys =
      this.props.viewer.keys.edges.length > 0
        ? ''
        : <LargeMessage>
            No messages. Click on <Icon icon="refresh" disabled /> to refresh
          </LargeMessage>;
    return (
      <div className="tableFillerRow" style={style.fillerRow}>
        <div style={style.keyCol}>
          {noKeys}
        </div>
        {this.state.langs.map(lang => <div key={lang} style={style.langCol} />)}
      </div>
    );
  }

  // ------------------------------------------
  // Langs
  // ------------------------------------------
  readLangs(): Array<string> {
    const availableLangs = this.props.viewer.config.langs;
    let langs = cookieGet('langs') || [];
    langs = filter(langs, o => availableLangs.indexOf(o) >= 0);
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

// ------------------------------------------
// Styles
// ------------------------------------------
const style = {
  outer: flexItem(
    '1 0 10em',
    flexContainer('column', {
      marginTop: 5,
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
// Public API
// ==========================================
const Container = Relay.createFragmentContainer(Translator, fragment);
export default Container;
export { Translator as _Translator };
