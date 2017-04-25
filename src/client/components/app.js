// @flow

/* eslint-env browser */

import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import moment from 'moment';
import {
  Spinner,
  Floats,
  Hints,
  Notifications,
  hintDefine,
  hintShow,
} from 'giu';
import type { ViewerT } from '../../common/types';
import _t from '../../translate';
import relayEnvironment from '../gral/relayEnvironment';
import { cookieGet, cookieSet } from '../gral/storage';
import Header from './050-header';
import Translator from './translator';
// import Details from './070-details';
// import Settings from './080-settings';
import fetchLangBundle from './fetchLangBundle';

require('./010-app.sass');

// Example MessageFormat message with plural, so that it appears in the screenshot:
// _t("someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}", { NUM: 1 })
// Example message with emoji, so that it appears in the screenshot:
// _t("someContext_Message with emoji: 🎉")
// Example message with American and British English versions, so that it appears in the screenshot:
// _t("someContext_A tool for internationalization")

// ==========================================
// Component declarations
// ==========================================
const query = graphql`
  query appQuery {
    viewer {
      ...translator_viewer
      # ...Settings_viewer
      # ...Details_viewer
    }
  }
`;

type Props = {
  viewer: ViewerT,
};

// ==========================================
// Component
// ==========================================
class App extends React.Component {
  props: Props;
  state: {
    selectedKeyId: ?string,
    fSettingsShown: boolean,
    lang: string,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedKeyId: null,
      fSettingsShown: false,
      lang: cookieGet('lang', { defaultValue: 'en' }),
    };
  }

  componentDidMount() {
    this.showHint();
  }

  // ------------------------------------------
  render() {
    return (
      <div style={style.outer}>
        <Floats />
        <Notifications />
        <Hints />
        <Header onShowSettings={this.showSettings} />
        <Translator
          lang={this.state.lang}
          viewer={this.props.viewer}
          selectedKeyId={this.state.selectedKeyId}
          changeSelectedKey={this.changeSelectedKey}
        />
        {/*
          <Details
            lang={this.state.lang}
            viewer={this.props.viewer}
            selectedKeyId={this.state.selectedKeyId}
          />
          {this.state.fSettingsShown &&
            <Settings
              lang={this.state.lang}
              viewer={this.props.viewer}
              onChangeLang={this.onChangeLang}
              onClose={this.hideSettings}
            />}
        */}
      </div>
    );
  }

  // ------------------------------------------
  changeSelectedKey = (selectedKeyId: ?string) => {
    this.setState({ selectedKeyId });
  };
  showSettings = () => {
    this.setState({ fSettingsShown: true });
  };
  hideSettings = () => {
    this.setState({ fSettingsShown: false });
  };
  onChangeLang = (lang: string) => {
    cookieSet('lang', lang);
    fetchLangBundle(lang, locales => {
      _t.setLocales(locales);
      moment.locale(lang);
      this.setState({ lang });
    });
  };

  // ------------------------------------------
  showHint(fForce: boolean = false) {
    const elements = () => {
      const out = [];
      const nodeSettings = document.getElementById('madyBtnSettings');
      if (nodeSettings) {
        const bcr = nodeSettings.getBoundingClientRect();
        const x = window.innerWidth / 2;
        out.push({
          type: 'LABEL',
          x,
          y: 70,
          align: 'center',
          children: _t('hint_Configure Mady'),
        });
        out.push({
          type: 'ARROW',
          from: { x, y: 70 },
          to: { x: bcr.left - 5, y: (bcr.top + bcr.bottom) / 2 },
        });
      }
      const nodeAddLang = document.getElementById('madyBtnAddLang');
      if (nodeAddLang) {
        const bcr = nodeAddLang.getBoundingClientRect();
        const x = window.innerWidth - 50;
        out.push({
          type: 'LABEL',
          x,
          y: 140,
          align: 'right',
          children: _t('hint_Add language column'),
        });
        out.push({
          type: 'ARROW',
          from: { x, y: 140 },
          to: { x: (bcr.left + bcr.right) / 2, y: bcr.bottom },
          counterclockwise: true,
        });
      }
      return out;
    };
    const closeLabel = _t('hint_Enjoy translating!');
    hintDefine('main', { elements, closeLabel });
    hintShow('main', fForce);
  }
}

// ------------------------------------------
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
const Container = () => (
  <QueryRenderer
    environment={relayEnvironment}
    query={query}
    render={({ error, props }) => {
      if (error) {
        return <div>{error.message}</div>;
      } else if (props) {
        return <App {...props} />;
      }
      return <Spinner />;
    }}
  />
);
export default Container;
export { App as _App };
