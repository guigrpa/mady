// @flow

/* eslint-env browser */
import timm from 'timm';
import React from 'react';
import Relay, { graphql } from 'react-relay';
import throttle from 'lodash/throttle';
import { getScrollbarWidth, flexItem, flexContainer, Icon, Select } from 'giu';
import type { Choice } from 'giu/lib/gral/types';
import type { ViewerT } from '../../common/types';
import _t from '../../translate';
import parseSrcFiles from '../mutations/parseSrcFiles';
import { COLORS } from '../gral/constants';
import { styleKeyCol, styleLangCol } from './adTranslatorStyles';
import { mutate } from './helpers';

// ==========================================
// Component declarations
// ==========================================
type Props = {
  // lang: string, // just for refresh
  langs: Array<string>,
  onAddLang: () => any,
  onRemoveLang: (ev: SyntheticEvent) => any,
  onChangeLang: (ev: SyntheticEvent, lang: string) => any,
  // Relay
  relay: Object,
  viewer: ViewerT,
};

const fragment = graphql`
  fragment ecTranslatorHeader_viewer on Viewer {
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
          ...edTranslatorRow_theKey
          translations(first: 100000) {
            edges {
              node {
                lang
                isDeleted
              }
            }
          }
        }
      }
    }
  }
`;

// ==========================================
// Component
// ==========================================
class TranslatorHeader extends React.PureComponent {
  props: Props;
  state: {
    fParsing: boolean,
  };
  forceRender: () => void;
  stats: {
    numTotalKeys: number,
    numUsedKeys: number,
    numTranslations: { [key: string]: number },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
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
    const { config } = this.props.viewer;
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
              {this.stats.numTotalKeys}
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
        {this.props.langs.map((lang, idx) =>
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
            onChange={this.props.onChangeLang}
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
          onClick={this.props.onRemoveLang}
        />
      </div>
    );
  }

  renderAdd() {
    const fDisabled =
      this.props.langs.length === this.props.viewer.config.langs.length;
    return (
      <div
        id="madyBtnAddLang"
        onClick={fDisabled ? undefined : this.props.onAddLang}
        title={_t('tooltip_Add column')}
        style={style.addLang(fDisabled)}
      >
        <Icon icon="plus" disabled={fDisabled} />
      </div>
    );
  }

  // ------------------------------------------
  onParseSrcFiles = () => {
    this.setState({ fParsing: true });
    mutate({
      description: 'Click on Parse source files',
      environment: this.props.relay.environment,
      mutationOptions: parseSrcFiles(),
      onFinish: () => this.setState({ fParsing: false }),
    });
  };

  // ------------------------------------------
  calcStats() {
    let numUsedKeys = 0;
    let numTotalKeys = 0;
    const numTranslations = {};
    const keyEdges = this.props.viewer.keys.edges;
    for (let i = 0; i < keyEdges.length; i++) {
      const key = keyEdges[i].node;
      if (key.isDeleted) continue;
      numTotalKeys += 1;
      if (key.unusedSince) continue;
      numUsedKeys += 1;
      const translationEdges = key.translations.edges;
      for (let k = 0; k < translationEdges.length; k++) {
        const translation = translationEdges[k].node;
        if (translation.isDeleted) continue;
        const { lang } = translation;
        if (numTranslations[lang] == null) numTranslations[lang] = 0;
        numTranslations[lang] += 1;
      }
    }
    this.stats = { numTotalKeys, numUsedKeys, numTranslations };
  }
}

// ------------------------------------------
// Styles
// ------------------------------------------
const style = {
  row: flexItem('none', flexContainer('row')),
  headerRow: {
    position: 'relative',
    fontWeight: 'bold',
  },
  headerCell: {
    paddingTop: 3,
    paddingBottom: 3,
    borderBottom: `1px solid ${COLORS.darkest}`,
    textAlign: 'center',
    fontWeight: 900,
    letterSpacing: 3,
  },
  numItems: { color: 'darkgrey' },
  keyCol: styleKeyCol,
  langCol: styleLangCol,
  langSelectorOuter: {
    position: 'relative',
    display: 'inline-block',
    paddingRight: 5,
  },
  langSelectorCaret: { marginRight: 5 },
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
const Container = Relay.createFragmentContainer(TranslatorHeader, fragment);
export default Container;
export { TranslatorHeader as _TranslatorHeader };
