import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import { pick }             from 'lodash';
import {
  bindAll,
  flexContainer,
  Icon,
  Select,
  Modal,
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
      config {
        langs
        srcPaths
        srcExtensions
        fMinify
      }
      ${UpdateConfigMutation.getFragment('viewer')}
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
    this.state = {
      config: pick(props.viewer.config, [
        'langs', 'srcPaths', 'srcExtensions', 'fMinify',
      ]),
      lang: props.lang,
    };
    bindAll(this, [
      'onCreateListItem',
      'onRemoveListItem',
      'onUpdateListItem',
      'onChangeCheckbox',
      'onChangeLang',
      'onCancel',
      'onSave',
    ]);
  }

  // ------------------------------------------
  render() {
    const buttons = [
      {
        label: _t('button_Cancel'),
        onClick: this.onCancel,
      },
      {
        label: _t('button_Save'),
        onClick: this.onSave,
      },
    ];
    return (
      <Modal buttons={buttons}>
        {this.renderConfig()}
      </Modal>
    );
  }

  renderConfig() {
    return (
      <div>
        <div style={style.configLine}>
          <label htmlFor="lang">
            {_t('settingsForm_Mady language:')}
          </label>
          {' '}
          <Select
            id="lang"
            value={this.state.lang}
            onChange={this.onChangeLang}
            options={LANG_OPTIONS}
          />
        </div>
        <div style={style.listLabel}>
          {_t('settingsForm_Languages (BCP47 codes):')}
        </div>
        {this.renderList({
          id: 'langs',
          dir: 'row',
          type: 'textInput',
          placeholder: 'e.g. es-ES',
          width: 80,
        })}
        <div style={style.listLabel}>
          {_t('settingsForm_Source paths:')}
        </div>
        {this.renderList({
          id: 'srcPaths',
          dir: 'column',
          type: 'textInput',
          placeholder: 'e.g. src/client',
          width: 200,
        })}
        <div style={style.listLabel}>
          {_t('settingsForm_Source extensions:')}
        </div>
        {this.renderList({
          id: 'srcExtensions',
          dir: 'row',
          type: 'textInput',
          placeholder: 'e.g. .js',
          width: 60,
        })}
        <div style={style.configLine}>
          <input
            id="fMinify"
            type="checkbox"
            checked={this.state.config.fMinify}
            onChange={this.onChangeCheckbox}
          />
          <label htmlFor="fMinify">
            {_t('settingsForm_Minify output JavaScript')}
          </label>
        </div>
      </div>
    );
  }

  renderList({ id, dir, type, placeholder, width }) {
    const values = this.state.config[id];
    return (
      <div>
        <div style={style.list(dir)}>
          {values.map((value, idx) => {
            let input;
            switch (type) {
              case 'textInput':
                input = (
                  <input
                    id={`${id}.${idx}`}
                    type="text"
                    value={value}
                    onChange={this.onUpdateListItem}
                    placeholder={placeholder}
                    style={style.input(width)}
                  />
                );
                break;
              default:
                input = null;
                break;
            }
            return (
              <div key={idx} style={style.listItem(dir)}>
                {input}
                {' '}
                <Icon
                  id={`${id}.${idx}`}
                  icon="remove"
                  onClick={this.onRemoveListItem}
                  style={style.remove}
                />
              </div>
            );
          })}
          <Icon
            id={id}
            icon="plus"
            onClick={this.onCreateListItem}
            style={style.add}
          />
        </div>
      </div>
    );
  }

  // ------------------------------------------
  onCreateListItem(ev) {
    const { id } = ev.currentTarget;
    const newList = timm.addLast(this.state.config[id], '');
    const config = timm.set(this.state.config, id, newList);
    this.setState({ config });
  }

  onRemoveListItem(ev) {
    const [id, idx] = ev.currentTarget.id.split('.');
    const newList = timm.removeAt(this.state.config[id], idx);
    const config = timm.set(this.state.config, id, newList);
    this.setState({ config });
  }

  onUpdateListItem(ev) {
    const [id, idx] = ev.currentTarget.id.split('.');
    const value = ev.currentTarget.value;
    const newList = timm.replaceAt(this.state.config[id], idx, value);
    const config = timm.set(this.state.config, id, newList);
    this.setState({ config });
  }

  onChangeCheckbox(ev) {
    const { id, checked } = ev.currentTarget;
    const config = timm.set(this.state.config, id, checked);
    this.setState({ config });
  }

  onChangeLang(ev, lang) { this.setState({ lang }); }

  onCancel() { this.props.onClose(); }
  onSave() {
    // Save lang
    if (this.state.lang !== this.props.lang) {
      this.props.onChangeLang(this.state.lang);
    }

    // Save other settings
    const { viewer } = this.props;
    const set = this.state.config;
    mutate({
      description: 'Click on Save settings',
      Mutation: UpdateConfigMutation,
      props: { viewer, set, unset: [] },
      onSuccess: () => this.props.onClose(),
      onFailure: () => alert('Configuration could not be saved'),
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
