import React                from 'react';
import Relay                from 'react-relay';
import { NodeQuery }        from '../gral/rootQueries';
import Header               from './050-header';
import Translator           from './060-translator';
import Details              from './070-details';
import Settings             from './080-settings';
import Modal                from './910-modal';
import { bindAll }          from './helpers';
require('./010-app.sass');

// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  viewer: () => Relay.QL`
    fragment on Viewer {
      keys {
        id
      }
      ${Translator.getFragment('viewer')}
      ${Settings.getFragment('viewer')}
    }
  `,
};

// ==========================================
// Component
// ==========================================
class App extends React.Component {
  static propTypes = {
    viewer:                 React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeyId: null,
      fSettingsShown: false,
    };
    bindAll(this, [
      'changeSelectedKey',
      'showSettings',
      'hideSettings',
    ]);
  }

  // ------------------------------------------
  render() {
    return (
      <div style={style.outer}>
        <Header
          onShowSettings={this.showSettings}
        />
        <Translator
          viewer={this.props.viewer}
          selectedKeyId={this.state.selectedKeyId}
          onChangeSelection={this.changeSelectedKey}
        />
        {this.renderDetails()}
        {this.renderSettings()}
      </div>
    );
  }

  renderDetails() {
    if (!this.state.selectedKeyId) return null;
    return (
      <Relay.RootContainer
        Component={Details}
        route={new NodeQuery({ id: this.state.selectedKeyId })}
      />
    );
  }

  renderSettings() {
    if (!this.state.fSettingsShown) return null;
    return (
      <Modal>
        <Settings
          viewer={this.props.viewer}
          onClose={this.hideSettings}
        />
      </Modal>
    );
  }

  // ------------------------------------------
  changeSelectedKey(selectedKeyId) { this.setState({ selectedKeyId }); }
  showSettings() { this.setState({ fSettingsShown: true }); }
  hideSettings() { this.setState({ fSettingsShown: false }); }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    minHeight: '100%',
    padding: '0px 10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(App, { fragments });
