import timm                 from 'timm';
import React                from 'react';
import Relay                from 'react-relay';
import {
  pick,
}                           from 'lodash';
import {
  UpdateConfigMutation,
}                           from '../gral/mutations';
import Select               from './900-select';
import Icon                 from './905-icon';
import {
  bindAll,
}                           from './helpers';

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
        'langs', 'srcPaths', 'srcExtensions'
      ]),
    };
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
          type: 'textInput',
          placeholder: 'e.g. es-ES',
          width: 80,
        })}
        <div style={style.listLabel}>Source paths:</div>
        {this.renderList({
          id: 'srcPaths',
          type: 'textInput',
          placeholder: 'e.g. src/client',
          width: 200,
        })}
        <div style={style.listLabel}>Source extensions:</div>
        {this.renderList({
          id: 'srcExtensions',
          type: 'textInput',
          placeholder: 'e.g. .js',
          width: 80,
        })}
      </div>
    )
  }

  renderList({ id, label, type, placeholder, width }) {
    const values = this.state.config[id];
    return (
      <div>
        <div style={style.list}>
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
              <div key={idx} style={style.listItem}>
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
        <span onClick={this.onCancel}>Cancel</span>
        {' '}
        <span onClick={this.onSave}>Save</span>
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

  onCancel() { this.props.onClose(); }
  onSave() {
    const { viewer } = this.props;
    const set = this.state.config;
    const mutation = new UpdateConfigMutation({ viewer, set, unset: [] });
    Relay.Store.commitUpdate(mutation, { onSuccess: this.props.onClose });
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  list: {
    marginLeft: 15,
  },
  listLabel: {
    marginTop: 7,
    marginBottom: 3,
  },
  listItem: {
    padding: '0px 2px',
    marginTop: 1,
  },
  input: width => ({ width }),
  add: {
    display: 'block',
    marginTop: 5,
  },
  buttons: {
    marginTop: 15,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
  },
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(Settings, { fragments });
