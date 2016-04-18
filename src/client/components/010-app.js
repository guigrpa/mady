import React                from 'react';
import Relay                from 'react-relay';
import moment               from 'moment';
import _t                   from '../../translate';
import Header               from './050-header';
import Translator           from './060-translator';
import Details              from './070-details';
import Settings             from './080-settings';
import Modal                from './910-modal';
import { bindAll }          from './helpers';
import {
  cookieGet,
  cookieSet,
}                           from '../gral/storage';
require('./010-app.sass');

// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  viewer: () => Relay.QL`
    fragment on Viewer {
      ${Translator.getFragment('viewer')}
      ${Settings.getFragment('viewer')}
      ${Details.getFragment('viewer')}
    }
  `,
};
const initialVariables = {
  selectedKeyId: null,
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
      lang: cookieGet('lang', { defaultValue: 'es-ES' }),
    };
    bindAll(this, [
      'changeSelectedKey',
      'showSettings',
      'hideSettings',
      'onChangeLang',
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
          lang={this.state.lang}
          viewer={this.props.viewer}
          selectedKeyId={this.state.selectedKeyId}
          changeSelectedKey={this.changeSelectedKey}
        />
        {this.renderDetails()}
        {this.renderSettings()}
      </div>
    );
  }

  renderDetails() {
    return (
      <Details
        lang={this.state.lang}
        viewer={this.props.viewer}
        selectedKeyId={this.state.selectedKeyId}
      />
    );
  }

  renderSettings() {
    if (!this.state.fSettingsShown) return null;
    return (
      <Modal>
        <Settings
          lang={this.state.lang}
          onChangeLang={this.onChangeLang}
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
  onChangeLang(lang) {
    cookieSet('lang', lang);
    require(`bundle!../../locales/${lang}`)(locales => {
      _t.setLocales(locales);
      moment.locale(lang);
      this.setState({ lang });
    });
  }
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
export default Relay.createContainer(App, { fragments, initialVariables });
