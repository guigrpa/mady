// @flow

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
import type {
  Viewer,
  RelayContainer,
}                           from '../../common/types';
import _t                   from '../../translate';
import {
  UpdateConfigMutation,
}                           from '../gral/mutations';
import { LANG_OPTIONS }     from '../gral/constants';
import { mutate }           from './helpers';


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
        msgRegexps
        fMinify
        fJsOutput
        fJsonOutput
        fReactIntlOutput
      }
    }
  `,
};

// ==========================================
// Component
// ==========================================
type PublicProps = {
  lang: string,
  viewer: Viewer,
  onChangeLang: (str: string) => void,
  onClose: () => void,
};
type Props = PublicProps;

class Settings extends React.Component {
  props: Props;
  state: {
    langs: Array<string>,
    srcPaths: Array<string>,
    srcExtensions: Array<string>,
    msgFunctionNames: Array<string>,
    msgRegexps: Array<string>,
    fJsOutput: boolean,
  };
  refLang: ?Object;
  refMinify: ?Object;
  refReactIntlOutput: ?Object;
  refJsonOutput: ?Object;

  // static propTypes = {
  //   lang:                   React.PropTypes.string.isRequired,
  //   viewer:                 React.PropTypes.object.isRequired,
  //   onChangeLang:           React.PropTypes.func.isRequired,
  //   onClose:                React.PropTypes.func.isRequired,
  // };
  //
  constructor(props: Props) {
    super(props);
    // For arrays without IDs, it's better if we keep the current state at this level,
    // rather than relying on `giu`. For other attributes (`lang`, `fMinify`...), we can
    // leave state handling entirely to `giu`, and fetch the value when the user clicks on
    // Save.
    this.state = pick(props.viewer.config, [
      'langs', 'srcPaths', 'srcExtensions', 'msgFunctionNames', 'msgRegexps', 'fJsOutput',
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
    const { fMinify, fJsonOutput, fReactIntlOutput } = this.props.viewer.config;
    const { fJsOutput } = this.state;
    return (
      <div>
        <div style={style.configLine}>
          <label htmlFor="lang">
            {_t('settingsForm_Mady language:')}
          </label>
          {' '}
          <Select ref={(c) => { this.refLang = c; }}
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
        <div style={style.listLabel}>
          {_t('settingsForm_ADVANCED: Additional regular expressions for message parsing:')}
          {' '}
          <Icon
            icon="info-circle"
            title={_t('settingsForm_Make sure your regular expression has exactly one capture group, for example: (.*?)')}
            style={style.info}
          />
        </div>
        {this.renderList({
          id: 'msgRegexps',
          dir: 'column',
          Component: TextInput,
          placeholder: 'e.g. {{\\s*(.*?)\\s*}}',
          width: 300,
        })}
        <div style={style.configLine}>
          <div>{_t('settingsForm_Output:')}</div>
          <div style={style.indented}>
            <Checkbox
              id="fJsOutput"
              value={fJsOutput}
              onChange={(ev, val) => this.setState({ fJsOutput: val })}
            />
            <label htmlFor="fJsOutput">
              {_t("settingsForm_JavaScript module (required if you use Mady's translation function)")}
            </label>
            {' '}
            <Checkbox
              ref={(c) => { this.refMinify = c; }}
              id="fMinify"
              disabled={!fJsOutput}
              value={fMinify}
            />
            <label htmlFor="fMinify">
              {_t('settingsForm_Minified')}
            </label>
          </div>
          <div style={style.indented}>
            <Checkbox ref={(c) => { this.refReactIntlOutput = c; }}
              id="fReactIntlOutput"
              value={fReactIntlOutput}
            />
            <label htmlFor="fReactIntlOutput">
              {_t('settingsForm_React Intl JSON file')}
            </label>
          </div>
          <div style={style.indented}>
            <Checkbox ref={(c) => { this.refJsonOutput = c; }} id="fJsonOutput" value={fJsonOutput} />
            <label htmlFor="fJsonOutput">
              {_t('settingsForm_Generic JSON file')}
            </label>
          </div>
        </div>
      </div>
    );
  }

  /* eslint-disable react/no-unused-prop-types */
  renderList({ id, dir, Component, placeholder, width }: {
    id: string,
    dir: string,
    Component: any,
    placeholder: string,
    width: number,
  }) {
  /* eslint-enable react/no-unused-prop-types */
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
  onCreateListItem(ev: Object) {
    const { id } = ev.currentTarget;
    const newList = timm.addLast(this.state[id], '');
    this.setState({ [id]: newList });
  }

  onRemoveListItem(ev: Object) {
    const [id, idx] = ev.currentTarget.id.split('.');
    const newList = timm.removeAt(this.state[id], Number(idx));
    this.setState({ [id]: newList });
  }

  onUpdateListItem(ev: Object) {
    const [id, idx] = ev.currentTarget.id.split('.');
    const value = ev.currentTarget.value;
    const newList = timm.replaceAt(this.state[id], idx, value);
    this.setState({ [id]: newList });
  }

  onCancel() { this.props.onClose(); }
  onSave() {
    // Save lang
    if (this.refLang == null) return;
    const lang = this.refLang.getValue();
    if (lang !== this.props.lang) this.props.onChangeLang(lang);

    // Save other settings
    const { viewer } = this.props;
    const set = pick(this.state, [
      'langs', 'srcPaths', 'srcExtensions', 'msgFunctionNames', 'msgRegexps',
    ]);
    if (this.refMinify == null) return;
    set.fMinify = this.refMinify.getValue();
    if (this.refReactIntlOutput == null) return;
    set.fReactIntlOutput = this.refReactIntlOutput.getValue();
    if (this.refJsonOutput == null) return;
    set.fJsonOutput = this.refJsonOutput.getValue();
    /* eslint-disable object-shorthand */
    mutate({
      description: 'Click on Save settings',
      Mutation: UpdateConfigMutation,
      props: { viewerId: viewer.id, set: set, unset: [] },
      onSuccess: () => this.props.onClose(),
      onFailure: () => notify({
        msg: _t('error_Configuration could not be saved'),
        type: 'error',
        icon: 'save',
      }),
    });
    /* eslint-enable object-shorthand */
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
  list: (dir) => flexContainer(dir, {
    marginLeft: 15,
  }),
  listItem: (dir) => ({
    padding: '0px 2px',
    marginTop: dir === 'column' ? 1 : undefined,
    marginRight: 10,
    whiteSpace: 'nowrap',
  }),
  input: (width) => ({ width }),
  add: {
    display: 'inline-block',
    marginTop: 5,
    color: '#444',
  },
  remove: { color: '#444' },
  configLine: {
    marginTop: 7,
  },
  indented: {
    marginLeft: 15,
  },
  info: {
    cursor: 'pointer',
  },
};

// ==========================================
// Public API
// ==========================================
const Container: RelayContainer<{}, PublicProps, any> =
  Relay.createContainer(Settings, { fragments });
export default Container;
export { Settings as _Settings };
