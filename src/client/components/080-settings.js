import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import { pick }             from 'lodash';
import {
  UpdateConfigMutation,
}                           from '../gral/mutations';
import {
  bindAll,
  mutate,
  flexContainer,
}                           from './helpers';
import Icon                 from './905-icon';
import Button               from './915-button';


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
    viewer:                 React.PropTypes.object.isRequired,
    onClose:                React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      config: pick(props.viewer.config, [
        'langs', 'srcPaths', 'srcExtensions', 'fMinify',
      ]),
    };
    bindAll(this, [
      'onCreateListItem',
      'onRemoveListItem',
      'onUpdateListItem',
      'onChangeCheckbox',
      'onCancel',
      'onSave',
    ]);
  }

  // ------------------------------------------
  render() {
    return (
      <div>
        {this.renderConfig()}
        {this.renderButtons()}
      </div>
    );
  }

  renderConfig() {
    return (
      <div>
        <div style={style.listLabel}>
          Languages (BCP47 codes):
        </div>
        {this.renderList({
          id: 'langs',
          dir: 'row',
          type: 'textInput',
          placeholder: 'e.g. es-ES',
          width: 80,
        })}
        <div style={style.listLabel}>Source paths:</div>
        {this.renderList({
          id: 'srcPaths',
          dir: 'column',
          type: 'textInput',
          placeholder: 'e.g. src/client',
          width: 200,
        })}
        <div style={style.listLabel}>Source extensions:</div>
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
          <label htmlFor="fMinify">Minify output JavaScript</label>
        </div>
      </div>
    )
  }

  renderList({ id, dir, label, type, placeholder, width }) {
    const values = this.state.config[id];
    return (
      <div>
        <div style={style.list(dir)}>
          {values.map((value, idx) => {
            let input;
            switch (type) {
              case 'textInput':
                input = <input
                  id={`${id}.${idx}`}
                  type="text"
                  value={value}
                  onChange={this.onUpdateListItem}
                  placeholder={placeholder}
                  style={style.input(width)}
                />;
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
                />
              </div>
            );
          })}
          <Icon 
            id={id}
            icon="plus"
            style={style.add}
            onClick={this.onCreateListItem}
          />
        </div>
      </div>
    )
  }

  renderButtons() {
    return (
      <div style={style.buttons}>
        <Button onClick={this.onCancel}>Cancel</Button>
        {' '}
        <Button onClick={this.onSave}>Save</Button>
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

  onCancel() { this.props.onClose(); }
  onSave() {
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
  },
  buttons: {
    marginTop: 15,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
  },
  configLine: {
    marginTop: 7,
  },
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(Settings, { fragments });
