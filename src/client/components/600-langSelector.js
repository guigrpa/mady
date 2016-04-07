import timm                 from 'timm';
import React                from 'react';

const LANGS = [
  { short: 'en_US', long: 'English (US)' },
  { short: 'en_GB', long: 'English (GB)' },
  { short: 'es_ES', long: 'Spanish' },
  { short: 'ca_CA', long: 'Catalan' },
  { short: 'de_DE', long: 'German' },
];

// ==========================================
// Component
// ==========================================
class LangSelector extends React.Component {
  static propTypes = {
    fAllowNull:             React.PropTypes.bool,
    onChange:               React.PropTypes.func.isRequired,
    value:                  React.PropTypes.string,
  };
  
  static defaultProps = {
    fAllowNull:             true,
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    const { fAllowNull, onChange, value } = this.props;
    const langs = fAllowNull 
      ? timm.addFirst(LANGS, { short: '_NULL_', long: '' })
      : LANGS;
    return (
      <select
        value={this.toInternalValue(value)}
        onChange={this.onChange}
      >
        {langs.map(lang => (
          <option key={lang.short} id={lang.short} value={lang.short}>{lang.long}</option>
        ))}
      </select>
    );
  }

  // ==========================================
  onChange(ev) {
    this.props.onChange(this.toExternalValue(ev.currentTarget.value));
  }

  toInternalValue(val) { return val != null ? val : '_NULL_' }
  toExternalValue(val) { return val != '_NULL_' ? val : null }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {},
};

// ==========================================
// Public API
// ==========================================
export default LangSelector;
