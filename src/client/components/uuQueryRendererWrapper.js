// @flow

import React from 'react';
import { QueryRenderer } from 'react-relay';
import { Spinner, LargeMessage } from 'giu';
import _t from '../../translate';
import { getEnvironment } from '../gral/relay';

type Props = {
  relayEnvironment?: Object,
  query: Object,
  vars?: Object,
  Component: ReactClass<*>,
  renderDuringLoad?: boolean,
};

const QueryRendererWrapper = ({
  relayEnvironment,
  query,
  vars,
  Component,
  renderDuringLoad,
  ...props
}: Props) => (
  <QueryRenderer
    environment={relayEnvironment || getEnvironment()}
    query={query}
    variables={vars}
    render={({ error, props: relayData }) => {
      if (error) {
        console.error(error); // eslint-disable-line
        return (
          <LargeMessage>{_t('error_Oops, an error occurred!')}</LargeMessage>
        );
      }
      if (relayData) {
        return <Component {...props} {...relayData} />;
      }
      if (renderDuringLoad) return <Component {...props} />;
      return <Spinner />;
    }}
  />
);

export default QueryRendererWrapper;
