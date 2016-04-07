import timm                 from 'timm';
import { mainStory }        from 'storyboard';
import React                from 'react';
import Relay                from 'react-relay';
import {
  ParseSrcFilesMutation,
}                           from '../gral/mutations';
import { getScrollbarWidth } from '../gral/constants';
import {
  flexItem,
  flexContainer,
}                           from './helpers';
import LangSelector         from './600-langSelector';

// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  viewer: () => Relay.QL`
    fragment on Viewer {
      keys {
        id
        context text
        unusedSince
      }
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
  };

  constructor(props) {
    super(props);
    let langs = ['en_US'];
    try {
      langs = JSON.parse(localStorage.madyLangs);
    } catch (err) {
      // Ignore error
    }
    this.state = {
      langs,
    };
    this.parseSrcFiles = this.parseSrcFiles.bind(this);
    this.forceFetch    = this.forceFetch.bind(this);
    this.renderKeyRow  = this.renderKeyRow.bind(this);
    this.clickKeyRow   = this.clickKeyRow.bind(this);
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
    return (
      <div 
        className="tableHeaderRow"
        style={timm.merge(style.row, style.headerRow)}
      >
        <div style={timm.merge(style.headerCell, style.keysCol)}>
          Keys [{this.props.viewer.keys.length}]
          {' '}
          <span onClick={this.parseSrcFiles}>Parse files</span>
        </div>
        {this.state.langs.map((lang, idx) => (
          <div key={lang}
            style={timm.merge(style.headerCell, style.langCol)}
          >
            <LangSelector 
              value={lang} 
              onChange={lang => this.changeLang(idx, lang)}
            />
          </div>)
        )}
        <div style={timm.merge(style.headerCell, style.addCol())}>+</div>
        <div style={style.scrollbarSpacer()}/>
      </div>
    );
  }

  renderBody() {
    return (
      <div
        className="tableBody"
        style={style.body}
      >
        { this.props.viewer.keys.map(this.renderKeyRow) }
        { this.renderFillerRow() }
      </div>
    );
  }

  renderKeyRow(key) {
    return (
      <div key={key.id}
        className="tableBodyRow"
        id={key.id}
        onClick={this.clickKeyRow}
        style={timm.merge(style.row, style.bodyRow)}
      >
        <div style={timm.merge(style.bodyCell, style.keysCol)}>
          {key.text}
        </div>
        {this.state.langs.map(lang => (
          <div key={lang}
            style={timm.merge(style.bodyCell, style.langCol)}
          >
            {lang}
          </div>)
        )}
        <div style={timm.merge(style.bodyCell, style.addCol())} />
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
        <div style={style.addCol()} />
      </div>
    );
  }

  // ==========================================
  clickKeyRow(ev) { 
    this.props.onChangeSelection(ev.currentTarget.id); 
  }

  parseSrcFiles() {
    mainStory.info('translator', 'Parse files');
    const mutation = new ParseSrcFilesMutation({ viewer: this.props.viewer });
    // FIXME: should not need to force fetch afterwards!!!
    Relay.Store.commitUpdate(mutation, { onSuccess: this.forceFetch });
  }

  changeLang(idx, lang) {
    const { langs } = this.state;
    langs[idx] = lang;
    this.setState({ langs });
  }

  // ==========================================
  forceFetch() { this.props.relay.forceFetch(); }
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
    borderBottom: '1px solid black',
  },
  bodyCell: {
    paddingTop: 1,
    paddingBottom: 1,
    borderBottom: '1px solid #ccc',
  },
  keysCol: flexItem('1 1 0px', {
    backgroundColor: '#eee',
    marginRight: 5,
    paddingLeft: 5,
    paddingRight: 5,
  }),
  langCol: flexItem('1 1 0px', {
    backgroundColor: '#eee',
    marginRight: 5,
    paddingLeft: 5,
    paddingRight: 5,
  }),
  addCol: () => flexItem('0 0 2em', {
    backgroundColor: '#ccc',
    marginRight: getScrollbarWidth() ? 5 : 0,
    borderBottom: '0px'
  }),

  scrollbarSpacer: () => flexItem(`0 0 ${getScrollbarWidth()}px`),
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(Translator, { fragments });
