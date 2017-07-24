// @flow

import React from 'react';
import QueryLookupRenderer from 'relay-query-lookup-renderer';
// import { QueryRenderer } from 'react-relay';
import { Spinner } from 'giu';
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
}: Props) =>
  <QueryLookupRenderer
    lookup
    environment={relayEnvironment || getEnvironment()}
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
