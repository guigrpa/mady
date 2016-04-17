import timm                 from 'timm';
import React                from 'react';
import { omit }             from 'lodash';
import { bindAll }          from './helpers';

// ==========================================
// Component
// ==========================================
class Select extends React.Component {
  static propTypes = {
    id:                     React.PropTypes.string,
    fAllowNull:             React.PropTypes.bool,
    options:                React.PropTypes.array.isRequired,
    value:                  React.PropTypes.string,
    onChange:               React.PropTypes.func.isRequired,
    // All other props are passed through
  };

  constructor(props) {
    super(props);
    bindAll(this, ['onChange']);
  }

  render() {
    const { fAllowNull, value, options } = this.props;
    const finalOptions = fAllowNull
      ? timm.addFirst(options, { value: '_NULL_', label: '' })
      : options;
    const otherProps = omit(this.props, [
      'fAllowNull', 'onChange', 'value', 'options',
    ]);
    return (
      <select
        value={this.toInternalValue(value)}
        onChange={this.onChange}
        {...otherProps}
      >
        {finalOptions.map(o => (
          <option key={o.value} id={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }

  // ==========================================
  onChange(ev) {
    const { value } = ev.currentTarget;
    const { onChange, id } = this.props;
    onChange(this.toExternalValue(value), id);
  }

  toInternalValue(val) { return val != null ? val : '_NULL_'; }
  toExternalValue(val) { return val !== '_NULL_' ? val : null; }
}

// ==========================================
// Public API
// ==========================================
export default Select;
