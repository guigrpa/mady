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
import parsedSrcFiles from '../subscriptions/parsedSrcFiles';
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
// Example of very long text
/* _t("someContext_Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet risus felis. Donec sed viverra urna. Praesent porttitor lorem id urna blandit, nec scelerisque risus varius. Nullam euismod suscipit scelerisque. Mauris placerat scelerisque nisi, vel rutrum purus dapibus et. Quisque mattis pulvinar eros in molestie. Suspendisse eleifend pretium nisi vel sagittis. In mollis diam sem, eget porta magna auctor nec. Maecenas rutrum eu magna sit amet feugiat. Nunc nec viverra dui. Suspendisse id lacus suscipit, volutpat sapien hendrerit, interdum risus. Mauris eu mollis lacus, ac posuere tortor. Integer quis pretium metus. Ut condimentum auctor elit, eu aliquet urna. Curabitur sit amet vulputate lorem, a lobortis risus.

Aliquam finibus lacinia iaculis. Nulla mattis lorem nec efficitur varius. Mauris tempus velit id auctor interdum. Sed facilisis, nunc id tincidunt sollicitudin, enim augue pulvinar ligula, vel consectetur lorem urna non velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi eget auctor enim, sit amet euismod tellus. Integer vitae odio in ligula pretium interdum ac nec enim. Vestibulum tellus orci, hendrerit eu tortor quis, pretium pharetra massa. In quis quam venenatis, auctor eros nec, convallis felis. Donec mattis orci aliquam elit placerat, ac finibus turpis interdum. Proin lorem quam, dignissim vel quam ac, mollis imperdiet ipsum. Etiam iaculis elementum leo. Nulla eu lectus nec metus gravida congue. Pellentesque tempus mauris vel mauris lacinia, iaculis volutpat eros sodales. Cras eu leo ligula. Proin tortor ex, viverra efficitur risus nec, accumsan sollicitudin est.")
*/

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
      keys(first: 100000) @connection(key: "App_viewer_keys") {
        edges {
          node {
            scope # for filtering
          }
        }
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
    scope: ?string,
  };

  isSubscribed = false;
  constructor() {
    super();
    this.state = {
      selectedKeyId: null,
      fSettingsShown: false,
      lang: cookieGet('lang', { defaultValue: 'en' }),
      filter: 'ALL',
      scope: null,
    };
  }

  componentDidMount() {
    if (!this.props._disableHints) this.showHint();
    const { environment } = this.props;
    if (!environment) return;
    subscribe({ environment, subscriptionOptions: updatedConfig() });
    subscribe({ environment, subscriptionOptions: updatedStats() });
    subscribe({ environment, subscriptionOptions: parsedSrcFiles() });
    subscribe({ environment, subscriptionOptions: updatedKey() });
    subscribe({ environment, subscriptionOptions: createdTranslation() });
    subscribe({ environment, subscriptionOptions: updatedTranslation() });
  }

  // ------------------------------------------
  render() {
    const { viewer } = this.props;
    const scopes = this.getScopes();
    const { scope } = this.state;
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
          scopes={scopes}
          scope={scope}
          changeScope={this.changeScope}
        />
        <Translator
          lang={this.state.lang}
          viewer={viewer}
          selectedKeyId={this.state.selectedKeyId}
          changeSelectedKey={this.changeSelectedKey}
          filter={this.state.filter}
          scope={scope}
        />
        {this.state.selectedKeyId && (
          <Details
            lang={this.state.lang}
            selectedKeyId={this.state.selectedKeyId}
          />
        )}
        {this.state.fSettingsShown && (
          <Settings
            lang={this.state.lang}
            config={viewer ? viewer.config : null}
            onChangeLang={this.onChangeLang}
            onClose={this.hideSettings}
          />
        )}
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

  changeScope = (scope: ?string) => {
    this.setState({ scope });
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
  getScopes() {
    const { edges } = this.props.viewer.keys;
    const scopes = {};
    for (let i = 0; i < edges.length; i++) {
      const { scope } = edges[i].node;
      if (scope) scopes[scope] = true;
    }
    const scopesArr = Object.keys(scopes).sort();
    return scopesArr;
  }

  showHint(fForce: boolean = false) {
    const elements = () => {
      const out = [];
      const nodeSettings = document.getElementById('madyBtnSettings');
      if (nodeSettings) {
        const bcr = nodeSettings.getBoundingClientRect();
        const x = window.innerWidth - 150;
        out.push({
          type: 'LABEL',
          x,
          y: 70,
          align: 'right',
          children: _t('hint_Configure Mady'),
        });
        out.push({
          type: 'ARROW',
          from: { x, y: 70 },
          to: { x: (bcr.left + bcr.right) / 2, y: bcr.bottom },
          counterclockwise: true,
        });
      }
      const nodeAddLang = document.getElementById('madyBtnAddLang');
      if (nodeAddLang) {
        const bcr = nodeAddLang.getBoundingClientRect();
        const x = window.innerWidth - 80;
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
const Container = ({ relayEnvironment }: { relayEnvironment?: Object }) => (
  <QueryRendererWrapper
    environment={relayEnvironment}
    query={query}
    Component={App}
  />
);
export default Container;
export { query, App as _App };
