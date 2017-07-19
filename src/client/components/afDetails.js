// @flow

import React from 'react';
import { graphql } from 'react-relay';
import moment from 'moment';
import { flexItem, Icon, LargeMessage } from 'giu';
import _t from '../../translate';
import { COLORS } from '../gral/constants';
import QueryRendererWrapper from './uuQueryRendererWrapper';

// ==========================================
// Component declarations
// ==========================================
type Props = {
  // lang: string,
  selectedKeyId: ?string,
};

const query = graphql`
  query afDetailsQuery($selectedKeyId: ID!) {
    node(id: $selectedKeyId) {
      ... on Key {
        firstUsed
        unusedSince
        description
        sources
      }
    }
  }
`;

// ==========================================
// Component
// ==========================================
class Details extends React.PureComponent {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      key: props.node,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.node) this.setState({ key: nextProps.node });
  }

  render() {
    this.key = this.props.node;
    return (
      <div style={style.outer}>
        <div style={style.title}>
          {_t('msgDetailsView_Details').toUpperCase()}
        </div>
        {this.renderContents()}
      </div>
    );
  }

  renderContents() {
    if (this.props.selectedKeyId == null) {
      return (
        <LargeMessage>
          {_t('msgDetailsView_No message selected')}
        </LargeMessage>
      );
    }
    if (!this.state.key) {
      return (
        <LargeMessage>
          <Icon icon="circle-o-notch" />
        </LargeMessage>
      );
    }
    const { description, sources, firstUsed, unusedSince } = this.state.key;
    const since = this.renderDate(firstUsed);
    const until = unusedSince
      ? <span>
          {' '}{_t('msgDetailsView_until')} {this.renderDate(unusedSince)}
        </span>
      : ':';
    const elSources = sources.length
      ? <ul style={style.srcList}>
          {sources.map((src, idx) =>
            <li key={idx}>
              {src}
            </li>
          )}
        </ul>
      : null;
    return (
      <div>
        {description &&
          <div>
            {description}
          </div>}
        {_t('msgDetailsView_Used since')} {since}
        {until}
        {elSources}
      </div>
    );
  }

  renderDate(d: string) {
    return (
      <span title={moment(d).format('LLLL')} style={style.date}>
        {moment(d).fromNow()}
      </span>
    );
  }
}

// ------------------------------------------
const style = {
  outer: flexItem('none', {
    minHeight: 110,
    backgroundColor: COLORS.medium,
    padding: 5,
    marginTop: 5,
  }),
  title: {
    fontWeight: 900,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    color: '#444',
  },
  srcList: {
    marginTop: 0,
  },
};

// ==========================================
// Public API
// ==========================================
const Container = ({ selectedKeyId, ...otherProps }) =>
  <QueryRendererWrapper
    query={query}
    vars={{ selectedKeyId }}
    Component={Details}
    renderDuringLoad
    selectedKeyId={selectedKeyId}
    {...otherProps}
  />;
export default Container;
export { Details as _Details };
