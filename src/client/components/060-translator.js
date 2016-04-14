import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import { throttle }         from 'lodash';
import {
  ParseSrcFilesMutation,
  CompileTranslationsMutation,
}                           from '../gral/mutations';
import {
  COLORS,
  getScrollbarWidth,
}                           from '../gral/constants';
import {
  bindAll,
  mutate,
  flexItem,
  flexContainer,
}                           from './helpers';
import Translation          from './062-translation';
import Select               from './900-select';
import Icon                 from './905-icon';
import hoverable            from './hocs/hoverable';

// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  viewer: () => Relay.QL`
    fragment on Viewer {
      config { langs }
      keys(first: 100000) { edges { node {
        id
        context text
        ${Translation.getFragment('theKey')}
        translations(first: 100000) { edges { node {
          id
          lang
          ${Translation.getFragment('translation')}
        }}}
      }}}
      ${ParseSrcFilesMutation.getFragment('viewer')}
    }
  `,
};

// ==========================================
// Component
// ==========================================
class Translator extends React.Component {
  static propTypes = {
    viewer:                 React.PropTypes.object.isRequired,
    selectedKeyId:          React.PropTypes.string,
    onChangeSelection:      React.PropTypes.func.isRequired,
    // From Hoverable
    hovering:               React.PropTypes.string,
    onHoverStart:           React.PropTypes.func.isRequired,
    onHoverStop:            React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      langs: this.readLangs(),
    };
    bindAll(this, [
      'renderKeyRow',

      'onAddLang',
      'onRemoveLang',
      'changeLang',

      'onParseSrcFiles',
      'onCompileTranslations',
      'onClickKeyRow',
    ]);
    this.forceRender = throttle(this.forceRender.bind(this), 200);
  }

  componentWillMount() { window.addEventListener('resize', this.forceRender); }
  componentWillUnmount() { window.removeEventListener('resize', this.forceRender); }
  forceRender() { this.forceUpdate(); }

  // ==========================================
  // Render
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
    const { keys, config } = this.props.viewer;
    const langOptions = config.langs.map(lang => ({ value: lang, label: lang }));
    return (
      <div
        className="tableHeaderRow"
        style={timm.merge(style.row, style.headerRow)}
      >
        <div style={timm.merge(style.headerCell, style.keysCol)}>
          KEYS <span style={style.numItems}>[{keys.edges.length}]</span>
          {' '}
          <Icon
            icon="refresh"
            title="Parse source files to update this list"
            onClick={this.onParseSrcFiles}
          />
          {' '}
          <Icon
            icon="save"
            title="Convert translations to JavaScript files"
            onClick={this.onCompileTranslations}
          />
        </div>
        {this.state.langs.map((lang, idx) => 
          this.renderLangHeader(lang, idx, langOptions)
        )}
        {this.renderAddCol(style.headerCell, true)}
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
          title="Change language"
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
        <Icon
          id={idx}
          icon="remove"
          title="Remove column"
          onClick={this.onRemoveLang}
        />
      </div>
    );
  }

  renderBody() {
    return (
      <div
        className="tableBody"
        style={style.body}
      >
        { this.props.viewer.keys.edges.map(this.renderKeyRow) }
        { this.renderFillerRow() }
      </div>
    );
  }

  renderKeyRow({ node: key }) {
    return (
      <div key={key.id}
        className="tableBodyRow"
        id={key.id}
        onClick={this.onClickKeyRow}
        style={timm.merge(style.row, style.bodyRow)}
      >
        <div style={timm.merge(style.bodyCell, style.keysCol)}>
          {key.text}
        </div>
        {this.state.langs.map(lang => this.renderTranslation(key, lang))}
        {this.renderAddCol(style.bodyCell)}
      </div>
    );
  }

  renderTranslation(key, lang) {
    const edge = key.translations.edges.find(({ node }) => node.lang === lang);
    const translation = edge ? edge.node : null;
    return (
      <div key={lang}
        style={timm.merge(style.bodyCell, style.langCol)}
      >
        <Translation
          theKey={key}
          lang={lang}
          translation={translation}
        />
      </div>
    );
  }

  renderFillerRow() {
    return (
      <div
        className="tableFillerRow"
        style={style.fillerRow}
      >
        <div style={style.keysCol} />
        {this.state.langs.map(lang => (
          <div key={lang}
            style={style.langCol}
          />
        ))}
        {this.renderAddCol()}
      </div>
    );
  }

  renderAddCol(baseStyle = {}, fIcon = false) {
    let icon;
    const fDisabled = this.state.langs.length === this.props.viewer.config.langs.length;
    if (fIcon) {
      icon = <Icon icon="plus" fDisabled={fDisabled} />;
    }
    return (
      <div
        id="addCol"
        onMouseEnter={this.props.onHoverStart}
        onMouseLeave={this.props.onHoverStop}
        onClick={fDisabled ? undefined : this.onAddLang}
        title="Add column"
        style={timm.merge(baseStyle, style.addCol(this.props.hovering, fDisabled))}
      >
        {icon}
      </div>
    );
  }

  // ==========================================
  // Langs
  // ==========================================
  readLangs() {
    let langs;
    try {
      langs = JSON.parse(localStorage.madyLangs);
    } catch (err) {
      langs = [];
      const availableLangs = this.props.viewer.config.langs;
      if (availableLangs.length) langs.push(availableLangs[0]);
      this.writeLangs(langs);
    }
    return langs;
  }

  writeLangs(langs) {
    try {
      localStorage.madyLangs = JSON.stringify(langs);
    } catch (err) { /* Ignore */ }
  }

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

  // ==========================================
  // Other handlers
  // ==========================================
  onParseSrcFiles() {
    mutate({
      description: 'Click on Parse source files',
      Mutation: ParseSrcFilesMutation,
      props: { viewer: this.props.viewer },
    });
  }

  onCompileTranslations() {
    mutate({
      description: 'Click on Compile translations',
      Mutation: CompileTranslationsMutation,
      props: {},
    });
  }

  onClickKeyRow(ev) {
    this.props.onChangeSelection(ev.currentTarget.id);
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: flexItem('1 0 10em', flexContainer('column', {
    marginTop: 5,
  })),

  body: flexItem(1, flexContainer('column', { overflowY: 'scroll' })),

  row: flexItem('none', flexContainer('row')),
  headerRow: { fontWeight: 'bold' },
  bodyRow: {},
  fillerRow: flexItem('1 1 0px', flexContainer('row')),

  headerCell: {
    paddingTop: 3,
    paddingBottom: 3,
    borderBottom: `1px solid ${COLORS.darkestBlue}`,
    textAlign: 'center',
    fontWeight: 900,
    letterSpacing: 3,
  },
  bodyCell: {
    paddingTop: 1,
    paddingBottom: 1,
    borderBottom: `1px solid ${COLORS.darkBlue}`,
  },
  numItems: {
    color: 'darkgrey',
  },
  keysCol: flexItem('1 1 0px', {
    backgroundColor: COLORS.lightBlue,
    marginRight: 5,
    paddingLeft: 5,
    paddingRight: 5,
  }),
  langCol: flexItem('1 1 0px', {
    backgroundColor: COLORS.lightBlue,
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
  addCol: (hovering, fDisabled) => flexItem('0 0 2em', {
    backgroundColor: hovering && !fDisabled ? COLORS.darkBlue : COLORS.mediumBlue,
    marginRight: getScrollbarWidth() ? 5 : 0,
    borderBottom: '0px',
    cursor: fDisabled ? undefined : 'pointer',
  }),

  scrollbarSpacer: () => flexItem(`0 0 ${getScrollbarWidth()}px`),
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(hoverable(Translator), { fragments });
