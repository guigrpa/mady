import React                from 'react';
import Relay                from 'react-relay';
import Header               from './050-header';
import Translator           from './060-translator';
import Details              from './070-details';
import { NodeQuery }        from '../gral/rootQueries';
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
      selectedKeyId: null, // props.viewer.keys[0].id
    };
    this.changeSelectedKey = this.changeSelectedKey.bind(this);
  }

  render() {
    return (
      <div style={style.outer}>
        <Header/>
        <Translator
          viewer={this.props.viewer}
          selectedKeyId={this.state.selectedKeyId}
          onChangeSelection={this.changeSelectedKey}
        />
        {this.renderDetails()}
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

  changeSelectedKey(selectedKeyId) { this.setState({ selectedKeyId }); }
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
