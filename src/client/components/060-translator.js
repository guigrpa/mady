import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { throttle }         from 'lodash';
import _t                   from '../../translate';
import {
  ParseSrcFilesMutation,
}                           from '../gral/mutations';
import {
  COLORS,
  getScrollbarWidth,
}                           from '../gral/constants';
import {
  cookieGet,
  cookieSet,
}                           from '../gral/storage';
import {
  bindAll,
  mutate,
  flexItem,
  flexContainer,
}                           from './helpers';
import TranslatorRow        from './061-translatorRow';
import Select               from './900-select';
import Icon                 from './905-icon';
import LargeMessage         from './920-largeMessage';

// ==========================================
// Translator
// ==========================================
const comparator = (a, b) => (a < b ? -1 : (a > b ? 1 : 0));
const keyComparator = (a, b) => {
  const aStr = `${a.context || ''}${a.text}${a.id}`;
  const bStr = `${b.context || ''}${b.text}${b.id}`;
  return comparator(aStr, bStr);
};

// ------------------------------------------
// Relay fragments
// ------------------------------------------
const fragments = {
  viewer: () => Relay.QL`
    fragment on Viewer {
      config { langs }
      keys(first: 100000) { edges { node {
        id unusedSince
        context text     # for sorting
        ${TranslatorRow.getFragment('theKey')}
        translations(first: 100000) { edges { node {
          lang
        }}}
      }}}
      ${ParseSrcFilesMutation.getFragment('viewer')}
      ${TranslatorRow.getFragment('viewer')}
    }
  `,
};

// ------------------------------------------
// Component
// ------------------------------------------
class Translator extends React.Component {
  static propTypes = {
    lang:                   React.PropTypes.string.isRequired,
    viewer:                 React.PropTypes.object.isRequired,
    selectedKeyId:          React.PropTypes.string,
    changeSelectedKey:      React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      langs: this.readLangs(),
      fParsing: false,
    };
    bindAll(this, [
      'renderKeyRow',

      'onAddLang',
      'onRemoveLang',
      'changeLang',

      'onParseSrcFiles',
    ]);
    this.forceRender = throttle(this.forceRender.bind(this), 200);
  }

  componentWillMount() { window.addEventListener('resize', this.forceRender); }
  componentWillUnmount() { window.removeEventListener('resize', this.forceRender); }
  forceRender() { this.forceUpdate(); }

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
    const langOptions = config.langs.map(lang => ({ value: lang, label: lang }));
    return (
      <div
        className="tableHeaderRow"
        style={timm.merge(style.row, style.headerRow)}
      >
        <div style={timm.merge(style.headerCell, style.keyCol)}>
          {_t('columnTitle_Messages').toUpperCase()}
          {' '}
          <span style={style.numItems}>
            [
              <span title={_t('tooltip_Used messages')}>{this.stats.numUsedKeys}</span>
              {' / '}
              <span title={_t('tooltip_Total messages')}>{keys.edges.length}</span>
            ]
          </span>
          {' '}
          <Icon
            icon="refresh"
            title={_t('tooltip_Parse source files to update the message list')}
            onClick={this.onParseSrcFiles}
            fSpin={this.state.fParsing}
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

  renderLangHeader(lang, idx, langOptions) {
    return (
      <div key={lang}
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
            onChange={this.changeLang}
            options={langOptions}
            style={style.langSelector}
          />
        </div>
        {' '}
        <span style={style.numItems}>
          [
            <span title={_t('tooltip_Translations')}>{this.stats.numTranslations[lang] || 0}</span>
            {' / '}
            <span title={_t('tooltip_Used messages')}>{this.stats.numUsedKeys}</span>
          ]
        </span>
        {' '}
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
    keys = keys.sort(keyComparator);
    return (
      <div
        className="tableBody"
        style={style.body}
      >
        {keys.map(this.renderKeyRow)}
        {this.renderFillerRow()}
      </div>
    );
  }

  renderKeyRow(key) {
    const fSelected = this.props.selectedKeyId === key.id;
    return (
      <TranslatorRow key={key.id}
        theKey={key}
        viewer={this.props.viewer}
        langs={this.state.langs}
        fSelected={fSelected}
        changeSelectedKey={this.props.changeSelectedKey}
        styleKeyCol={style.keyCol}
        styleLangCol={style.langCol}
      />
    );
  }

  renderFillerRow() {
    const noKeys = this.props.viewer.keys.edges.length > 0 ? '' :
      <LargeMessage>
        No messages. Click on <Icon icon="refresh" fDisabled /> to refresh
      </LargeMessage>;
    return (
      <div
        className="tableFillerRow"
        style={style.fillerRow}
      >
        <div style={style.keyCol}>{noKeys}</div>
        {this.state.langs.map(lang => (
          <div key={lang}
            style={style.langCol}
          />
        ))}
      </div>
    );
  }

  renderAdd() {
    const fDisabled = this.state.langs.length === this.props.viewer.config.langs.length;
    return (
      <div
        id="addLang"
        onClick={fDisabled ? undefined : this.onAddLang}
        title={_t('tooltip_Add column')}
        style={style.addLang(fDisabled)}
      >
        <Icon icon="plus" fDisabled={fDisabled} />
      </div>
    );
  }

  // ------------------------------------------
  // Langs
  // ------------------------------------------
  readLangs() {
    let langs = cookieGet('langs');
    if (langs == null) {
      langs = [];
      const availableLangs = this.props.viewer.config.langs;
      if (availableLangs.length) langs.push(availableLangs[0]);
      this.writeLangs(langs);
    }
    return langs;
  }

  writeLangs(langs) { cookieSet('langs', langs); }

  onAddLang() {
    const prevLangs = this.state.langs;
    const availableLangs = this.props.viewer.config.langs;
    const newLang = availableLangs.find(o => prevLangs.indexOf(o) < 0);
    if (newLang == null) return;
    const nextLangs = timm.addLast(prevLangs, newLang);
    this.updateLangs(nextLangs);
  }

  onRemoveLang(ev) { this.removeLang(Number(ev.currentTarget.id)); }
  removeLang(idx) {
    const nextLangs = timm.removeAt(this.state.langs, idx);
    this.updateLangs(nextLangs);
  }

  changeLang(lang, idx) {
    const prevLangs = this.state.langs;
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
  }

  updateLangs(langs) {
    this.writeLangs(langs);
    this.setState({ langs });
  }

  // ------------------------------------------
  // Other handlers
  // ------------------------------------------
  onParseSrcFiles() {
    this.setState({ fParsing: true });
    mutate({
      description: 'Click on Parse source files',
      Mutation: ParseSrcFilesMutation,
      props: { viewer: this.props.viewer },
      onFinish: () => this.setState({ fParsing: false }),
    });
  }

  // ------------------------------------------
  // Helpers
  // ------------------------------------------
  calcStats() {
    let numUsedKeys = 0;
    const numTranslations = {};
    for (const { node: key } of this.props.viewer.keys.edges) {
      if (key.unusedSince) continue;
      numUsedKeys++;
      for (const { node: translation } of key.translations.edges) {
        const { lang } = translation;
        if (numTranslations[lang] == null) numTranslations[lang] = 0;
        numTranslations[lang]++;
      }
    }
    this.stats = { numUsedKeys, numTranslations };
  }
}

// ------------------------------------------
// Styles
// ------------------------------------------
const style = {
  outer: flexItem('1 0 10em', flexContainer('column', {
    marginTop: 5,
  })),

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
  addLang: (fDisabled) => {
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

// ------------------------------------------
// Build container
// ------------------------------------------
const TranslatorContainer = Relay.createContainer(Translator, {
  fragments,
});


// ==========================================
// Public API
// ==========================================
export default TranslatorContainer;
