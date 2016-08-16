import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import { pick }             from 'lodash';
import {
  bindAll,
  flexContainer,
  Icon,
  Select, Checkbox, TextInput,
  Modal,
  notify,
}                           from 'giu';
import _t                   from '../../translate';
import {
  UpdateConfigMutation,
}                           from '../gral/mutations';
import { mutate }           from './helpers';
import { LANG_OPTIONS }     from '../gral/constants';


// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  viewer: () => Relay.QL`
    fragment on Viewer {
      id
      config {
        langs
        srcPaths
        srcExtensions
        msgFunctionNames
        fMinify
      }
    }
  `,
};

// ==========================================
// Component
// ==========================================
class Settings extends React.Component {
  static propTypes = {
    lang:                   React.PropTypes.string.isRequired,
    viewer:                 React.PropTypes.object.isRequired,
    onChangeLang:           React.PropTypes.func.isRequired,
    onClose:                React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    // For arrays without IDs, it's better if we keep the current state at this level,
    // rather than relying on `giu`. For other attributes (`lang`, `fMinify`), we can
    // leave state handling entirely to `giu`, and fetch the value when the user clicks on
    // Save.
    this.state = pick(props.viewer.config, [
      'langs', 'srcPaths', 'srcExtensions', 'msgFunctionNames',
    ]);
    bindAll(this, [
      'onCreateListItem',
      'onRemoveListItem',
      'onUpdateListItem',
      'onCancel',
      'onSave',
    ]);
  }

  // ------------------------------------------
  render() {
    const buttons = [
      { label: _t('button_Cancel'), onClick: this.onCancel, left: true },
      { label: _t('button_Save'), onClick: this.onSave, defaultButton: true },
    ];
    return (
      <Modal
        buttons={buttons}
        onEsc={this.onCancel}
        onClickBackdrop={this.onCancel}
      >
        {this.renderConfig()}
      </Modal>
    );
  }

  renderConfig() {
    const { lang } = this.props;
    const { fMinify } = this.props.viewer.config;
    return (
      <div>
        <div style={style.configLine}>
          <label htmlFor="lang">
            {_t('settingsForm_Mady language:')}
          </label>
          {' '}
          <Select ref={c => { this.refLang = c; }}
            value={lang}
            items={LANG_OPTIONS}
            required
          />
        </div>
        <div style={style.listLabel}>
          {_t('settingsForm_Languages (BCP47 codes):')}
        </div>
        {this.renderList({
          id: 'langs',
          dir: 'row',
          Component: TextInput,
          placeholder: 'e.g. es-ES, ca…',
          width: 80,
        })}
        <div style={style.listLabel}>
          {_t('settingsForm_Source paths:')}
        </div>
        {this.renderList({
          id: 'srcPaths',
          dir: 'column',
          Component: TextInput,
          placeholder: 'e.g. src/client',
          width: 300,
        })}
        <div style={style.listLabel}>
          {_t('settingsForm_Source extensions:')}
        </div>
        {this.renderList({
          id: 'srcExtensions',
          dir: 'row',
          Component: TextInput,
          placeholder: 'e.g. .js',
          width: 60,
        })}
        <div style={style.listLabel}>
          {_t('settingsForm_Message translation functions to look for:')}
        </div>
        {this.renderList({
          id: 'msgFunctionNames',
          dir: 'row',
          Component: TextInput,
          placeholder: 'e.g. _t',
          width: 60,
        })}
        <div style={style.configLine}>
          <Checkbox ref={c => { this.refMinify = c; }} id="fMinify" value={fMinify} />
          <label htmlFor="fMinify">
            {_t('settingsForm_Minify output JavaScript')}
          </label>
        </div>
      </div>
    );
  }

  renderList({ id, dir, Component, placeholder, width }) {
    const values = this.state[id];
    return (
      <div style={style.list(dir)}>
        {values.map((value, idx) =>
          <div key={idx} style={style.listItem(dir)}>
            <Component
              id={`${id}.${idx}`}
              value={value}
              placeholder={placeholder}
              onChange={this.onUpdateListItem}
              required errorZ={52}
              style={style.input(width)}
            />&nbsp;
            <Icon
              id={`${id}.${idx}`}
              icon="remove"
              onClick={this.onRemoveListItem}
              style={style.remove}
            />
          </div>
        )}
        <Icon
          id={id}
          icon="plus"
          onClick={this.onCreateListItem}
          style={style.add}
        />
      </div>
    );
  }

  // ------------------------------------------
  onCreateListItem(ev) {
    const { id } = ev.currentTarget;
    const newList = timm.addLast(this.state[id], '');
    this.setState({ [id]: newList });
  }

  onRemoveListItem(ev) {
    const [id, idx] = ev.currentTarget.id.split('.');
    const newList = timm.removeAt(this.state[id], Number(idx));
    this.setState({ [id]: newList });
  }

  onUpdateListItem(ev) {
    const [id, idx] = ev.currentTarget.id.split('.');
    const value = ev.currentTarget.value;
    const newList = timm.replaceAt(this.state[id], idx, value);
    this.setState({ [id]: newList });
  }

  onCancel() { this.props.onClose(); }
  onSave() {
    // Save lang
    const lang = this.refLang.getValue();
    if (lang !== this.props.lang) this.props.onChangeLang(lang);

    // Save other settings
    const { viewer } = this.props;
    const set = pick(this.state, [
      'langs', 'srcPaths', 'srcExtensions', 'msgFunctionNames',
    ]);
    set.fMinify = this.refMinify.getValue();
    mutate({
      description: 'Click on Save settings',
      Mutation: UpdateConfigMutation,
      props: { viewerId: viewer.id, set, unset: [] },
      onSuccess: () => this.props.onClose(),
      onFailure: () => notify({
        msg: _t('error_Configuration could not be saved'),
        type: 'error',
        icon: 'save',
      }),
    });
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  listLabel: {
    marginTop: 7,
    marginBottom: 3,
  },
  list: dir => flexContainer(dir, {
    marginLeft: 15,
  }),
  listItem: dir => ({
    padding: '0px 2px',
    marginTop: dir === 'column' ? 1 : undefined,
    marginRight: 10,
    whiteSpace: 'nowrap',
  }),
  input: width => ({ width }),
  add: {
    display: 'inline-block',
    marginTop: 5,
    color: '#444',
  },
  remove: { color: '#444' },
  configLine: {
    marginTop: 7,
  },
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(Settings, { fragments });
