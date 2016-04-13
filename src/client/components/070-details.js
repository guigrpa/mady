import React                from 'react';
import Relay                from 'react-relay';
import moment               from 'moment';
import {
  flexItem,
}                           from './helpers';

// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  detailedKey: () => Relay.QL`
    fragment on Key {
      context text
      firstUsed unusedSince
      sources
    }
  `,
};

// ==========================================
// Component
// ==========================================
class Details extends React.Component {
  static propTypes = {
    detailedKey:                React.PropTypes.object,
  };

  render() {
    return (
      <div style={style.outer}>
        {this.renderContents()}
      </div>
    );
  }

  renderContents() {
    const key = this.props.detailedKey;
    if (!key) return <i>Details for the selected key will be shown here</i>;
    const { text } = key;
    return (
      <div>
        <div style={style.text}>{text}</div>
        {this.renderSources()}
      </div>
    );
  }

  renderSources() {
    const { sources, firstUsed, unusedSince } = this.props.detailedKey;
    const since = this.renderDate(firstUsed);
    const until = unusedSince 
      ? <span> until {this.renderDate(unusedSince)}</span>
      : ':';
    const elSources = sources.length
      ? <ul style={style.srcList}>
          {sources.map((src, idx) => <li key={idx}>{src}</li>)}
        </ul>
      : null;
    return (
      <div>
        Used since {since}{until}
        {elSources}
      </div>
    );
  }

  renderDate(d) {
    return (
      <span title={moment(d).format('LLLL')} style={style.date}>
        {moment(d).fromNow()}
      </span>
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: flexItem('none', {
    minHeight: 100,
    backgroundColor: '#ccc',
    padding: 5,
    marginTop: 5,
  }),
  text: {
    marginBottom: 5,
    fontWeight: 'bold',
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
export default Relay.createContainer(Details, { fragments });
