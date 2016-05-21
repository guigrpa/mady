import React                from 'react';
import Relay                from 'react-relay';
import {
  bindAll, cancelEvent,
  Icon, Textarea,
  KEYS,
  hoverable,
}                           from 'giu';
import _t                   from '../../translate';
import {
  CreateTranslationMutation,
  UpdateTranslationMutation,
  DeleteTranslationMutation,
}                           from '../gral/mutations';
import { COLORS }           from '../gral/constants';
import { mutate }           from './helpers';

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
      cmds: [],
    };
    bindAll(this, [
      'onFocus',
      'onBlur',
      'onKeyDown',
      'onKeyUp',
      'onClickCopyKey',
      'onClickDelete',
    ]);
  }

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
    const { translation } = this.props;
    const { cmds } = this.state;
    // const fUpdating = translation && relay.hasOptimisticUpdate(translation);
    return (
      <Textarea ref={c => { this.refInput = c; }}
        value={translation ? translation.translation : null}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        cmds={cmds}
        style={style.textareaBase(this.state)}
      />
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
  onFocus() {
    this.setState({ fEditing: true });
    this.props.changeSelectedKey(this.props.theKey.id);
  }

  onKeyDown(ev) {
    if (ev.which === KEYS.enter &&
        (ev.ctrlKey || ev.altKey || ev.metaKey || ev.shiftKey)) {
      cancelEvent(ev);
    }
  }

  onKeyUp(ev) {
    if (ev.which === KEYS.esc) {
      this.setState({ cmds: [{ type: 'REVERT' }, { type: 'BLUR' }] });
    } else if (ev.which === KEYS.enter &&
               (ev.ctrlKey || ev.altKey || ev.metaKey || ev.shiftKey)) {
      this.setState({ cmds: [{ type: 'BLUR' }] });
    }
  }

  onBlur() {
    this.setState({ fEditing: false });
    if (!this.refInput) return;
    this.refInput.validateAndGetValue()
    .then(text => {
      if (text === this.getInitialTranslation()) return;
      const description = 'Commit translation edit';
      let Mutation;
      let props;
      if (this.props.translation) {
        Mutation = UpdateTranslationMutation;
        props = {
          translation: this.props.translation,
          set: {
            translation: text,
          },
        };
      } else {
        Mutation = CreateTranslationMutation;
        props = {
          set: {
            lang: this.props.lang,
            keyId: this.props.theKey.id,
            translation: text,
          },
        };
      }
      mutate({ description, Mutation, props });
    });
  }

  onClickCopyKey() {
    this.setState({
      cmds: [
        { type: 'SET_VALUE', value: this.props.theKey.text },
        { type: 'FOCUS' },
      ],
    });
  }

  onClickDelete() {
    mutate({
      description: 'Click on Delete translation',
      Mutation: DeleteTranslationMutation,
      props: {
        id: this.props.translation.id,
        theKey: this.props.theKey,
      },
    });
  }

  // ==========================================
  // Helpers
  // ==========================================
  getInitialTranslation(props = this.props) {
    return props.translation ? props.translation.translation : null;
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    paddingRight: 40,
    marginBottom: -2,
  },
  textareaBase: ({ fEditing }) => ({
    padding: 0,
    border: '1px solid transparent',
    backgroundColor: fEditing ? undefined : 'transparent',
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
    marginTop: 1,
    marginBottom: 2,
    fontStyle: 'italic',
    color: COLORS.dim,
  },
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(hoverable(Translation), { fragments });
