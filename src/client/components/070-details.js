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
  node: () => Relay.QL`
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
    node:                   React.PropTypes.object,
  };

  render() {
    return (
      <div style={style.outer}>
        {this.renderContents()}
      </div>
    );
  }

  renderContents() {
    const key = this.props.node;
    if (!key) return null;
    const { text, firstUsed } = key;
    return (
      <div>
        <div style={style.text}>{text}</div>
        {this.renderSources()}
      </div>
    );
  }

  renderSources() {
    const { sources, firstUsed, unusedSince } = this.props.node;
    let out;
    if (sources.length) {
      out = (
        <div>
          First used <i>{this.renderDate(firstUsed)}</i>. Currently used in:
          <ul style={style.srcList}>
            {sources.map((src, idx) => <li key={idx}>{src}</li>)}
          </ul>
        </div>
      );
    } else {
      out = (
        <div>
          First used {this.renderDate(firstUsed)}.
          Unused since {this.renderDate(unusedSince)}.
        </div>
      );
    }
    return out;
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
