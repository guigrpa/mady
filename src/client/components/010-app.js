import React                from 'react';
import Relay                from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        Hello!
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        config {
          srcPaths
          srcExtensions
          langs
        }
      }
    `,
  },
});
