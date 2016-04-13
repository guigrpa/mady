import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import {
  CreateTranslationMutation,
  UpdateTranslationMutation,
  DeleteTranslationMutation,
}                           from '../gral/mutations';
import {
  bindAll,
  flexItem,
  flexContainer,
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
    }
  `,
  translation: () => Relay.QL`
    fragment on Translation {
      id
      lang, translation
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
    if (!nextProps.translation && this.props.translation) {
      this.setState({ text: '' });
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
    return (
      <div>
        <input ref={(c) => this._input = c}
          type="text" 
          value={this.state.text}
          onChange={this.onChange}
          onClick={this.editStart}
          style={style.input(this.state)}
        />
      </div>
    )
  }

  renderButtons() {
    if (!this.state.fEditing) return null;
    const elDelete = this.props.translation 
      ? <span>
          {' | '}
          <Button
            onClick={this.deleteTranslation}
            fCancelMouseDown
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
        >
          Copy key
        </Button>
        {' | '}
        <Button 
          onClick={this.editCommit}
          fCancelMouseDown
        >
          Save
        </Button>
        {' | '}
        <Button
          onClick={this.editRevert}
          fCancelMouseDown
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
  editStart() { this.setState({ fEditing: true }); }
  editCommit() {
    let mutation = null;
    if (this.props.translation) {
      mutation = new UpdateTranslationMutation({
        id: this.props.translation.id,
        set: {
          translation: this.state.text,
        },
      });
    } else {
      mutation = new CreateTranslationMutation({
        set: {
          lang: this.props.lang,
          keyId: this.props.theKey.id,
          translation: this.state.text,
        },
      });
    }
    Relay.Store.commitUpdate(mutation);
    this.setState({ fEditing: false });
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
    const mutation = new DeleteTranslationMutation({
      id: this.props.translation.id,
      keyId: this.props.theKey.id,
    });
    Relay.Store.commitUpdate(mutation);
  }

  // ==========================================
  // Helpers
  // ==========================================
  getInitialTranslation() {
    return this.props.translation ? this.props.translation.translation : '';
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  input: ({ fEditing }) => ({
    background: fEditing ? undefined : 'transparent',
    border: fEditing ? undefined : '0px solid transparent',
    width: '100%',
    cursor: 'beam',
  }),
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(Translation, { fragments });
