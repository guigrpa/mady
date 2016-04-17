import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { COLORS }           from '../gral/constants';
import {
  DeleteKeyMutation,
}                           from '../gral/mutations';
import {
  bindAll,
  mutate,
  flexItem,
  flexContainer,
}                           from './helpers';
import Translation          from './062-translation';
import Icon                 from './905-icon';
import hoverable            from './hocs/hoverable';

// ------------------------------------------
// Relay fragments
// ------------------------------------------
const fragments = {
  theKey: () => Relay.QL`
    fragment on Key {
      id
      context text
      unusedSince
      ${Translation.getFragment('theKey')}
      translations(first: 100000) { edges { node {
        id
        lang
        ${Translation.getFragment('translation')}
      }}}
    }
  `,
  viewer: () => Relay.QL`
    fragment on Viewer {
      ${DeleteKeyMutation.getFragment('viewer')}
    }
  `,
};

// ------------------------------------------
// Component
// ------------------------------------------
class TranslatorRow extends React.Component {
  static propTypes = {
    theKey:                 React.PropTypes.object.isRequired,
    viewer:                 React.PropTypes.object.isRequired,
    langs:                  React.PropTypes.array.isRequired,
    fSelected:              React.PropTypes.bool.isRequired,
    changeSelectedKey:      React.PropTypes.func.isRequired,
    styleKeyCol:            React.PropTypes.object.isRequired,
    styleLangCol:           React.PropTypes.object.isRequired,
    // From hoverable
    hovering:               React.PropTypes.string,
    onHoverStart:           React.PropTypes.func.isRequired,
    onHoverStop:            React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, [
      'renderTranslation',
      'onClickKeyRow',
      'onClickDeleteKey',
    ]);
  }

  // ------------------------------------------
  // Render
  // ------------------------------------------
  render() {
    const {
      theKey: key, fSelected, styleKeyCol,
      hovering, onHoverStart, onHoverStop,
    } = this.props;
    const fUnused = !!key.unusedSince;
    const elContext = key.context
      ? <span style={style.context}>{key.context}</span>
      : undefined;
    const elDeleteKey = hovering
      ? (
        <Icon
          icon="remove"
          onClick={this.onClickDeleteKey}
          style={style.removeIcon}
        />
      )
      : undefined;
    let cellStyle = timm.merge(style.bodyCell, styleKeyCol, style.keyCell);
    if (fSelected) cellStyle = style.selected(cellStyle);
    if (fUnused) cellStyle = style.unused(cellStyle);
    return (
      <div
        className="tableBodyRow"
        id={key.id}
        onClick={this.onClickKeyRow}
        style={style.row}
      >
        <div
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverStop}
          style={cellStyle}
        >
          {elContext}{key.text}{elDeleteKey}
        </div>
        {this.props.langs.map(this.renderTranslation)}
      </div>
    );
  }

  renderTranslation(lang) {
    const { theKey: key, fSelected, styleLangCol } = this.props;
    const edge = key.translations.edges.find(({ node }) => node.lang === lang);
    const translation = edge ? edge.node : null;
    let cellStyle = timm.merge(style.bodyCell, styleLangCol);
    if (!edge) cellStyle = style.untranslated(cellStyle);
    if (fSelected) cellStyle = style.selected(cellStyle);
    return (
      <div key={lang}
        style={cellStyle}
      >
        <Translation
          theKey={key}
          lang={lang}
          translation={translation}
          changeSelectedKey={this.props.changeSelectedKey}
          fUnused={!!key.unusedSince}
        />
      </div>
    );
  }

  // ------------------------------------------
  // Handlers
  // ------------------------------------------
  onClickKeyRow() { this.props.changeSelectedKey(this.props.theKey.id); }

  onClickDeleteKey() {
    const { viewer } = this.props;
    mutate({
      description: 'Click on Delete key',
      Mutation: DeleteKeyMutation,
      props: { viewer, id: this.props.theKey.id },
    });
  }
}

// ------------------------------------------
// Styles
// ------------------------------------------
const style = {
  row: flexItem('none', flexContainer('row')),
  bodyCell: {
    position: 'relative',
    paddingTop: 1,
    paddingBottom: 1,
    borderBottom: `1px solid ${COLORS.dark}`,
  },
  keyCell: {
    paddingRight: 17,
  },
  selected: (base) => timm.merge(base, {
    backgroundColor: COLORS.medium,
  }),
  unused: (base) => timm.merge(base, {
    color: COLORS.dim,
  }),
  untranslated: (base) => timm.merge(base, {
    backgroundColor: COLORS.mediumAlt,
  }),
  context: {
    fontWeight: 900,
    marginRight: 10,
  },
  removeIcon: {
    position: 'absolute',
    top: 3,
    right: 5,
    color: 'black',
  },
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(hoverable(TranslatorRow), { fragments });
