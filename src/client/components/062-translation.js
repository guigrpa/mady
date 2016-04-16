import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
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
import Button               from './915-button';

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
    theKey:                 React.PropTypes.object.isRequired,
    lang:                   React.PropTypes.string.isRequired,
    translation:            React.PropTypes.object,
    changeSelectedKey:      React.PropTypes.func.isRequired,
    fUnused:                React.PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      fEditing: false,
      text: this.getInitialTranslation(),
    };
    bindAll(this, [
      'onChange',
      'copyKey',
      'editStart',
      'editCommit',
      'editRevert',
      'editBlur',
      'deleteTranslation',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.translation !== this.props.translation) {
      this.setState({
        text: this.getInitialTranslation(nextProps),
      });
    }
  }

  // ==========================================
  // Render
  // ==========================================
  render() {
    return (
      <div
        onFocus={this.editStart}
        onBlur={this.editBlur}
      >
        {this.renderTranslation()}
        {this.renderButtons()}
      </div>
    );
  }

  renderTranslation() {
    const { translation, relay, fUnused } = this.props;
    const fUpdating = translation && relay.hasOptimisticUpdate(translation);
    return (
      <div>
        <input ref={(c) => this._input = c}
          type="text" 
          value={this.state.text}
          onChange={this.onChange}
          onClick={this.editStart}
          style={style.input(this.state, { fUnused, fUpdating })}
        />
      </div>
    )
  }

  renderButtons() {
    if (!this.state.fEditing) return null;
    const translation = this.props.translation;
    const elDelete = translation
      ? <span>
          {' | '}
          <Button
            onClick={this.deleteTranslation}
            fCancelMouseDown
            fText
          >
            Delete
          </Button>
        </span>
      : null;
    return (
      <div>
        <Button
          onClick={this.copyKey}
          fCancelMouseDown
          fText
        >
          Copy key
        </Button>
        {' | '}
        <Button
          onClick={this.editCommit}
          fCancelMouseDown
          fText
        >
          Save
        </Button>
        {' | '}
        <Button
          onClick={this.editRevert}
          fCancelMouseDown
          fText
        >
          Revert
        </Button>
        {elDelete}
      </div>
    );
  }

  // ==========================================
  // Handlers
  // ==========================================
  onChange(ev) { this.setState({ text: ev.currentTarget.value }); }
  copyKey(ev) { this.setState({ text: this.props.theKey.text }); }
  editStart() {
    this.setState({ fEditing: true });
    this.props.changeSelectedKey(this.props.theKey.id);
  }
  editCommit() {
    let description = 'Click on Save translation';
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
    this.setState({
      fEditing: false,
      text: this.getInitialTranslation(),
    });
    this._input.blur();
  }
  editRevert() {
    this.setState({
      fEditing: false,
      text: this.getInitialTranslation(),
    });
    this._input.blur();
  }
  editBlur() {
    if (this.state.text === this.getInitialTranslation()) {
      this.setState({ fEditing: false });
    }
    // TODO: auto-commit, depending on settings
  }
  deleteTranslation() {
    this.editRevert();
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
    return props.translation ? props.translation.translation : '';
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  input: ({ fEditing }, { fUnused, fUpdating }) => ({
    background: fEditing ? undefined : 'transparent',
    border: fEditing ? undefined : '0px solid transparent',
    color: fUpdating ? 'red' : (fUnused ? COLORS.dim : undefined),
    width: '100%',
    cursor: 'beam',
  }),
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(Translation, { fragments });
