// @flow

import React from 'react';
import { QueryRenderer } from 'react-relay';
import { Spinner } from 'giu';
import relayEnvironment from '../gral/relayEnvironment';

type Props = {
  query: Object,
  vars?: Object,
  Component: ReactClass<*>,
  renderDuringLoad?: boolean,
};

const QueryRendererWrapper = ({
  query,
  vars,
  Component,
  renderDuringLoad,
  ...props
}: Props) =>
  <QueryRenderer
    environment={relayEnvironment}
    query={query}
    variables={vars}
    render={({ error, props: relayData }) => {
      if (error) {
        return (
          <div>
            {error.message}
          </div>
        );
      }
      if (relayData) {
        return <Component {...props} {...relayData} />;
      }
      if (renderDuringLoad) return <Component {...props} />;
      return <Spinner />;
    }}
  />;

export default QueryRendererWrapper;
