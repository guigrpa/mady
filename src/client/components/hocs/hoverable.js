import React                from 'react';
import { bindAll }          from '../helpers';

export default function hoverable(ComposedComponent) {
  return class extends React.Component {
    static propTypes = {
      onHoverStart:           React.PropTypes.func,
      onHoverStop:            React.PropTypes.func,
    };

    constructor(props) {
      super(props);
      this.state = { hovering: null };
      bindAll(this, [
        'onHoverStart',
        'onHoverStop',
      ]);
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          hovering={this.state.hovering}
          onHoverStart={this.onHoverStart}
          onHoverStop={this.onHoverStop}
        />
      );
    }

    onHoverStart(ev) {
      const id = ev.currentTarget.id || true;
      this.setState({ hovering: id });
      if (this.props.onHoverStart) this.props.onHoverStart(ev);
    }

    onHoverStop(ev) {
      this.setState({ hovering: null });
      if (this.props.onHoverStop) this.props.onHoverStop(ev);
    }
  };
}
