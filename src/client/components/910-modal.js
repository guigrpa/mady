import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';

// ==========================================
// Component
// ==========================================
class Modal extends React.Component {
  static propTypes = {
    children:               React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div style={style.outer}>
        <div style={style.backdrop} />
        <div style={style.modal}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white',
    opacity: 0.7,
  },
  modal: {
    position: 'fixed',
    top: '5vh',
    left: '2.5vw',
    right: '2.5vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: 20,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: 2,
  },
};

// ==========================================
// Public API
// ==========================================
export default Modal;
