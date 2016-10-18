// @flow

import React from 'react';
import {
  addLocaleData, defineMessages,
  IntlProvider, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';
import esLocaleData from 'react-intl/locale-data/es';

addLocaleData(esLocaleData);

defineMessages({
  reactIntlSample1: {
    id: 'reactIntlSample1',
    description: 'Message to greet the user',
    defaultMessage: 'someContext_Hello, {NAME}!',
  },
});

const Example = ({ lang, messages }: {
  lang: string,
  messages: Object,
}) => {
  const name = 'Eric';
  const unreadCount = 1000;
  return (
    <IntlProvider key={lang} locale={lang} messages={messages}>
      <p>
        <FormattedMessage
          id="reactIntlSample2"
          defaultMessage={
            `someContext_Hello {NAME}, you have {UNREAD_COUNT, number} {UNREAD_COUNT, plural,
              one {message}
              other {messages}
            }`
          }
          values={{ NAME: <b>{name}</b>, UNREAD_COUNT: unreadCount }}
        />
        <br />
        <FormattedHTMLMessage
          id="reactIntlSample3"
          defaultMessage="someContext_<i>Hi</i> <b>{NAME}</b>!"
          values={{ NAME: name, unreadCount }}
        />
      </p>
    </IntlProvider>
  );
};

export default Example;
