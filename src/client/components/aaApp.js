// @flow

/* eslint-env browser */

import React from 'react';
import { graphql } from 'react-relay';
import moment from 'moment';
import { Floats, Hints, Notifications, hintDefine, hintShow } from 'giu';
import type { KeyFilter } from '../gral/types';
import type { ViewerT } from '../../common/types';
import _t from '../../translate';
import { cookieGet, cookieSet } from '../gral/storage';
import { subscribe } from './helpers';
import updatedConfig from '../subscriptions/updatedConfig';
import updatedStats from '../subscriptions/updatedStats';
import createdKey from '../subscriptions/createdKey';
import updatedKey from '../subscriptions/updatedKey';
import createdTranslation from '../subscriptions/createdTranslation';
import updatedTranslation from '../subscriptions/updatedTranslation';
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
  // Unit testing
  _disableHints?: boolean,
  // Relay
  environment: Object,
  viewer: ViewerT,
};

const query = graphql`
  query aaAppQuery {
    viewer {
      id
      ...adTranslator_viewer
      config {
        ...aeSettings_config
      }
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
    filter: KeyFilter,
  };

  isSubscribed = false;
  constructor() {
    super();
    this.state = {
      selectedKeyId: null,
      fSettingsShown: false,
      lang: cookieGet('lang', { defaultValue: 'en' }),
      filter: 'ALL',
    };
  }

  componentDidMount() {
    if (!this.props._disableHints) this.showHint();
    const { environment, viewer } = this.props;
    if (!environment) return;
    subscribe({ environment, subscriptionOptions: updatedConfig() });
    subscribe({ environment, subscriptionOptions: updatedStats() });
    subscribe({
      environment,
      subscriptionOptions: createdKey({ viewerId: viewer.id }),
    });
    subscribe({ environment, subscriptionOptions: updatedKey() });
    subscribe({ environment, subscriptionOptions: createdTranslation() });
    subscribe({ environment, subscriptionOptions: updatedTranslation() });
  }

  // ------------------------------------------
  render() {
    const { viewer } = this.props;
    return (
      <div style={style.outer}>
        <Floats />
        <Notifications />
        <Hints />
        <Header
          lang={this.state.lang}
          onShowSettings={this.showSettings}
          filter={this.state.filter}
          changeFilter={this.changeFilter}
        />
        <Translator
          lang={this.state.lang}
          viewer={viewer}
          selectedKeyId={this.state.selectedKeyId}
          changeSelectedKey={this.changeSelectedKey}
          filter={this.state.filter}
        />
        {this.state.selectedKeyId &&
          <Details
            lang={this.state.lang}
            selectedKeyId={this.state.selectedKeyId}
          />}
        {this.state.fSettingsShown &&
          <Settings
            lang={this.state.lang}
            config={viewer ? viewer.config : null}
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

  changeFilter = (filter: KeyFilter) => {
    this.setState({ filter });
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
      const nodeFilterMenu = document.getElementById('madyMenuFilter');
      if (nodeFilterMenu) {
        const bcr = nodeFilterMenu.getBoundingClientRect();
        const x = 50;
        out.push({
          type: 'LABEL',
          x,
          y: 140,
          align: 'left',
          children: _t('hint_Filter relevant messages'),
        });
        out.push({
          type: 'ARROW',
          from: { x, y: 140 },
          to: { x: (bcr.left + bcr.right) / 2, y: bcr.bottom },
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
const Container = ({ relayEnvironment }: { relayEnvironment?: Object }) =>
  <QueryRendererWrapper
    environment={relayEnvironment}
    query={query}
    Component={App}
  />;
export default Container;
export { query, App as _App };
