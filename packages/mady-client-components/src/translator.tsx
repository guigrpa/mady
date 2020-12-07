import React from 'react';
import { Icon } from 'giu';

// ==============================================
// Declarations
// ==============================================
type Props = unknown;
type State = unknown;

// ==============================================
// Component
// ==============================================
class Translator extends React.Component<Props, State> {
  render() {
    return (
      <>
        <h2>
          Translator <Icon icon="cog" />
        </h2>
      </>
    );
  }
}

// ==============================================
// Public
// ==============================================
export default Translator;
