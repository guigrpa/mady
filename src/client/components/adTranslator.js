// @flow

/* eslint-env browser */
import timm from 'timm';
import React from 'react';
import Relay, { graphql } from 'react-relay';
import throttle from 'lodash/throttle';
import filter from 'lodash/filter';
import {
  getScrollbarWidth,
  flexItem,
  flexContainer,
  Icon,
  Select,
  LargeMessage,
} from 'giu';
import type { Choice } from 'giu/lib/gral/types';
import type { ViewerT, KeyT } from '../../common/types';
import _t from '../../translate';
import parseSrcFiles from '../mutations/parseSrcFiles';
import { COLORS } from '../gral/constants';
import { cookieGet, cookieSet } from '../gral/storage';
import { mutate } from './helpers';
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
  // lang: string,
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
          translations(first: 100000) {
            edges {
              node {
                lang
              }
            }
          }
        }
      }
    }
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
    fParsing: boolean,
  };
  forceRender: () => void;
  stats: {
    numUsedKeys: number,
    numTranslations: { [key: string]: number },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      langs: this.readLangs(),
      fParsing: false,
    };
    this.forceRender = throttle(this.forceRender.bind(this), 200);
  }

  componentDidMount() {
    window.addEventListener('resize', this.forceRender);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.forceRender);
  }
  forceRender() {
    this.forceUpdate();
  }

  // ------------------------------------------
  // Render
  // ------------------------------------------
  render() {
    this.calcStats();
    return (
      <div style={style.outer}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }

  renderHeader() {
    const { keys, config } = this.props.viewer;
    const langOptions = config.langs.map(lang => ({
      value: lang,
      label: lang,
    }));
    return (
      <div
        className="tableHeaderRow"
        style={timm.merge(style.row, style.headerRow)}
      >
        <div style={timm.merge(style.headerCell, style.keyCol)}>
          {_t('columnTitle_Messages').toUpperCase()}{' '}
          <span style={style.numItems}>
            [
            <span title={_t('tooltip_Used messages')}>
              {this.stats.numUsedKeys}
            </span>
            {' / '}
            <span title={_t('tooltip_Total messages')}>
              {keys.edges.length}
            </span>
            ]
          </span>{' '}
          <Icon
            icon="refresh"
            title={_t('tooltip_Parse source files to update the message list')}
            onClick={this.onParseSrcFiles}
            spin={this.state.fParsing}
          />
        </div>
        {this.state.langs.map((lang, idx) =>
          this.renderLangHeader(lang, idx, langOptions)
        )}
        {this.renderAdd()}
        <div style={style.scrollbarSpacer()} />
      </div>
    );
  }

  renderLangHeader(lang: string, idx: number, langOptions: Array<Choice>) {
    return (
      <div
        key={lang}
        className="madyLangHeader"
        style={timm.merge(style.headerCell, style.langCol)}
      >
        <div
          title={_t('tooltip_Change language')}
          style={style.langSelectorOuter}
        >
          <Icon icon="caret-down" style={style.langSelectorCaret} />
          {lang}
          <Select
            id={idx}
            value={lang}
            onChange={this.onChangeLang}
            required
            items={langOptions}
            style={style.langSelector}
          />
        </div>{' '}
        <span style={style.numItems}>
          [
          <span title={_t('tooltip_Translations')}>
            {this.stats.numTranslations[lang] || 0}
          </span>
          {' / '}
          <span title={_t('tooltip_Used messages')}>
            {this.stats.numUsedKeys}
          </span>
          ]
        </span>{' '}
        <Icon
          id={idx}
          icon="remove"
          title={_t('tooltip_Remove column (does NOT delete any translations)')}
          onClick={this.onRemoveLang}
        />
      </div>
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

  renderAdd() {
    const fDisabled =
      this.state.langs.length === this.props.viewer.config.langs.length;
    return (
      <div
        id="madyBtnAddLang"
        onClick={fDisabled ? undefined : this.onAddLang}
        title={_t('tooltip_Add column')}
        style={style.addLang(fDisabled)}
      >
        <Icon icon="plus" disabled={fDisabled} />
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

  // ------------------------------------------
  // Other handlers
  // ------------------------------------------
  onParseSrcFiles = () => {
    this.setState({ fParsing: true });
    mutate({
      description: 'Click on Parse source files',
      mutationOptions: parseSrcFiles(),
      onFinish: () => this.setState({ fParsing: false }),
    });
  };

  // ------------------------------------------
  // Helpers
  // ------------------------------------------
  calcStats() {
    let numUsedKeys = 0;
    const numTranslations = {};
    const keyEdges = this.props.viewer.keys.edges;
    for (let i = 0; i < keyEdges.length; i++) {
      const key = keyEdges[i].node;
      if (key.unusedSince) continue;
      numUsedKeys += 1;
      const translationEdges = key.translations.edges;
      for (let k = 0; k < translationEdges; k++) {
        const translation = translationEdges[k].node;
        const { lang } = translation;
        if (numTranslations[lang] == null) numTranslations[lang] = 0;
        numTranslations[lang] += 1;
      }
    }
    this.stats = { numUsedKeys, numTranslations };
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

  headerCell: {
    paddingTop: 3,
    paddingBottom: 3,
    borderBottom: `1px solid ${COLORS.darkest}`,
    textAlign: 'center',
    fontWeight: 900,
    letterSpacing: 3,
  },
  numItems: {
    color: 'darkgrey',
  },
  keyCol: flexItem('1 1 0px', {
    backgroundColor: COLORS.light,
    marginRight: 5,
    paddingLeft: 5,
    paddingRight: 17,
  }),
  langCol: flexItem('1 1 0px', {
    backgroundColor: COLORS.light,
    marginRight: 5,
    paddingLeft: 5,
    paddingRight: 5,
  }),
  langSelectorOuter: {
    position: 'relative',
    display: 'inline-block',
    paddingRight: 5,
  },
  langSelectorCaret: {
    marginRight: 5,
  },
  langSelector: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  addLang: fDisabled => {
    const scrollbarWidth = getScrollbarWidth();
    return {
      position: 'absolute',
      top: 0,
      right: 5 + scrollbarWidth,
      cursor: fDisabled ? undefined : 'pointer',
      padding: '3px 6px',
      fontWeight: 900,
      letterSpacing: 3,
    };
  },

  scrollbarSpacer: () => flexItem(`0 0 ${getScrollbarWidth()}px`),
};

// ==========================================
// Public API
// ==========================================
const Container = Relay.createFragmentContainer(Translator, fragment);
export default Container;
export { Translator as _Translator };
