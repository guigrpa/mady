import React                from 'react';
import Relay                from 'react-relay';
import _t                   from '../../translate';
import {
  CreateTranslationMutation,
  UpdateTranslationMutation,
  DeleteTranslationMutation,
}                           from '../gral/mutations';
import { COLORS }           from '../gral/constants';
import {
  bindAll,
  mutate,
}                           from './helpers';
import Icon                 from './905-icon';
import hoverable            from './hocs/hoverable';

// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  theKey: () => Relay.QL`
    fragment on Key {
      id
      text
      ${DeleteTranslationMutation.getFragment('theKey')}
    }
  `,
  translation: () => Relay.QL`
    fragment on Translation {
      id
      lang, translation
      ${UpdateTranslationMutation.getFragment('translation')}
    }
  `,
};

// ==========================================
// Component
// ==========================================
class Translation extends React.Component {
  static propTypes = {
    relay:                  React.PropTypes.object.isRequired,
    theKey:                 React.PropTypes.object.isRequired,
    lang:                   React.PropTypes.string.isRequired,
    translation:            React.PropTypes.object,
    changeSelectedKey:      React.PropTypes.func.isRequired,
    fUnused:                React.PropTypes.bool.isRequired,
    // From hoverable
    hovering:               React.PropTypes.bool,
    onHoverStart:           React.PropTypes.func.isRequired,
    onHoverStop:            React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      fEditing: false,
      text: this.getInitialTranslation(),
    };
    bindAll(this, [
      'onChange',
      'onFocus',
      'onBlur',
      'onKeyUp',
      'onClickCopyKey',
      'onClickDelete',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.translation !== this.props.translation) {
      this.setState({
        text: this.getInitialTranslation(nextProps),
      });
    }
  }

  componentDidMount() { this.resizeTextarea(); }
  componentDidUpdate() { this.resizeTextarea(); }

  // ==========================================
  // Render
  // ==========================================
  render() {
    return (
      <div
        onMouseEnter={this.props.onHoverStart}
        onMouseLeave={this.props.onHoverStop}
        style={style.outer}
      >
        {this.renderTranslation()}
        {this.renderButtons()}
        {this.renderHelp()}
      </div>
    );
  }

  renderTranslation() {
    const { translation, relay, fUnused } = this.props;
    const fUpdating = translation && relay.hasOptimisticUpdate(translation);
    const fEmpty = !this.state.text.length;
    return (
      <div style={style.textareaWrapper}>
        <div ref={c => { this._refPlaceholder = c; }}
          style={style.placeholder(this.state, { fUnused, fUpdating, fEmpty })}
        >
          {fEmpty ? 'x' : this.state.text}
        </div>
        <textarea ref={c => { this._refInput = c; }}
          value={this.state.text}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}
          style={style.textarea(this.state, { fUnused, fUpdating })}
        />
      </div>
    );
  }

  renderButtons() {
    if (!this.state.fEditing && !this.props.hovering) return null;
    const { translation } = this.props;
    const elDelete = translation
      ? <Icon
          icon="remove"
          title={_t('tooltip_Delete translation')}
          onClick={this.onClickDelete}
          style={style.iconButton}
        />
      : null;
    return (
      <div style={style.buttons}>
        <Icon
          icon="copy"
          title={_t('tooltip_Copy message')}
          onClick={this.onClickCopyKey}
          style={style.iconButton}
        />
        {elDelete}
      </div>
    );
  }

  renderHelp() {
    if (!this.state.fEditing) return null;
    return (
      <div style={style.help}>
        {_t('translationHelp_Click outside or TAB to save. ESC to undo.')}
      </div>
    );
  }

  // ==========================================
  // Handlers
  // ==========================================
  onChange(ev) { this.setState({ text: ev.currentTarget.value }); }
  onFocus() {
    this.setState({ fEditing: true });
    this.props.changeSelectedKey(this.props.theKey.id);
  }
  onKeyUp(ev) {
    if (ev.which !== 27) return;
    this.revert(() => { this._refInput.blur(); })
  }
  onBlur() {
    this.setState({ fEditing: false });
    if (this.state.text === this.getInitialTranslation()) return;
    const description = 'Commit translation edit';
    let Mutation;
    let props;
    if (this.props.translation) {
      Mutation = UpdateTranslationMutation;
      props = {
        translation: this.props.translation,
        set: {
          translation: this.state.text,
        },
      };
    } else {
      Mutation = CreateTranslationMutation;
      props = {
        set: {
          lang: this.props.lang,
          keyId: this.props.theKey.id,
          translation: this.state.text,
        },
      };
    }
    mutate({ description, Mutation, props });
    this.setState({ text: this.getInitialTranslation() });
  }

  onClickCopyKey() {
    this.setState({ text: this.props.theKey.text });
    this._refInput.focus();
  }
  onClickDelete() {
    this.revert(() => {
      mutate({
        description: 'Click on Delete translation',
        Mutation: DeleteTranslationMutation,
        props: {
          id: this.props.translation.id,
          theKey: this.props.theKey,
        },
      });
    });
  }

  // ==========================================
  // Helpers
  // ==========================================
  revert(cb) {
    this.setState({
      fEditing: false,
      text: this.getInitialTranslation(),
    }, cb);
  }

  getInitialTranslation(props = this.props) {
    return props.translation ? props.translation.translation : '';
  }

  resizeTextarea() {
    // if (this._refInput.scrollHeight > 150) {
    //   console.log(this._refInput)
    //   console.log(`${this._refInput.scrollHeight}, ${this._refInput.offsetHeight}`)
    // }
    let height = this._refPlaceholder.offsetHeight;
    if (this.state.fEditing) height += 4
    this._refInput.style.height = `${height}px`;
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    paddingRight: 40,
  },
  textareaWrapper: {
    position: 'relative',
  },
  placeholder: ({ fEditing }, { fUnused, fUpdating, fEmpty }) => ({
    opacity: (fEditing || fEmpty) ? 0 : 1,
    color: fUpdating ? 'red' : (fUnused ? COLORS.dim : undefined),
    width: '100%',
    cursor: 'beam',
  }),
  textarea: ({ fEditing }, { fUpdating }) => ({
    position: 'absolute',
    top: -1,
    left: -1,
    width: '100%',
    padding: fEditing ? '0px 0px 3px 0px' : '0px 0px 0px 0px',
    overflow: 'hidden',
    opacity: fEditing ? 1 : 0,
    background: fEditing ? undefined : 'transparent',
    border: fEditing ? undefined : '0px solid transparent',
    color: fUpdating ? 'red' : 'black',
    cursor: 'beam',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    resize: 'none',
  }),
  buttons: {
    position: 'absolute',
    top: 1,
    right: 5,
    color: 'black',
  },
  iconButton: {
    marginLeft: 5,
  },
  help: {
    marginTop: 2,
    fontStyle: 'italic',
    color: COLORS.dim,
  },
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(hoverable(Translation), { fragments });
