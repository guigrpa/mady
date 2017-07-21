// @flow

/* eslint-env browser */

import React from 'react';
import { graphql } from 'react-relay';
import moment from 'moment';
import { Floats, Hints, Notifications, hintDefine, hintShow } from 'giu';
import type { ViewerT } from '../../common/types';
import _t from '../../translate';
import { cookieGet, cookieSet } from '../gral/storage';
import Header from './abHeader';
import Translator from './adTranslator';
import Details from './afDetails';
import Settings from './aeSettings';
import QueryRendererWrapper from './uuQueryRendererWrapper';
import fetchLangBundle from './fetchLangBundle';

require('./aaApp.sass');

// Example MessageFormat message with plural, so that it appears in the screenshot:
// _t("someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}", { NUM: 1 })
// Example message with emoji, so that it appears in the screenshot:
// _t("someContext_Message with emoji: 🎉")
// Example message with American and British English versions, so that it appears in the screenshot:
// _t("someContext_A tool for internationalization")

// ==========================================
// Component declarations
// ==========================================
type Props = {
  // Relay
  viewer: ViewerT,
};

const query = graphql`
  query aaAppQuery {
    viewer {
      ...adTranslator_viewer
      ...aeSettings_viewer
    }
  }
`;

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

  constructor() {
    super();
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
        {this.state.selectedKeyId &&
          <Details
            lang={this.state.lang}
            selectedKeyId={this.state.selectedKeyId}
          />}
        {this.state.fSettingsShown &&
          <Settings
            lang={this.state.lang}
            viewer={this.props.viewer}
            onChangeLang={this.onChangeLang}
            onClose={this.hideSettings}
          />}
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
const Container = ({ relayEnvironment }) =>
  <QueryRendererWrapper
    environment={relayEnvironment}
    query={query}
    Component={App}
  />;
export default Container;
export { query, App as _App };
