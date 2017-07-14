// @flow

import React from 'react';
import { QueryRenderer } from 'react-relay';
import { Spinner } from 'giu';
import relayEnvironment from '../gral/relayEnvironment';

const QueryRendererWrapper = ({
  query,
  vars,
  Component,
  renderDuringLoad,
  ...props
}) =>
  <QueryRenderer
    environment={relayEnvironment}
    query={query}
    variables={vars}
    render={({ error, props: relayData }) => {
      if (error)
        return (
          <div>
            {error.message}
          </div>
        );
      if (relayData) {
        return <Component {...props} {...relayData} />;
      }
      if (renderDuringLoad) return <Component {...props} />;
      return <Spinner />;
    }}
  />;

export default QueryRendererWrapper;
