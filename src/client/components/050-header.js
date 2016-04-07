import React                from 'react';

// ==========================================
// Component
// ==========================================
class Header extends React.Component {
  render() {
    return (
      <div style={style.outer}>
        A
      </div>
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    flex: '0 0 2em',
    WebkitFlex: '0 0 2em',
    backgroundColor: '#ccc',
    padding: 5,
  },
};

// ==========================================
// Public API
// ==========================================
export default Header;
