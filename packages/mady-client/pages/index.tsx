import React from 'react';
import { Translator } from 'mady-client-components';
import { Notifications, Floats } from 'giu';

// ==============================================
// Declarations
// ==============================================
type Props = unknown;
type State = {};

// ==============================================
// Component
// ==============================================
class App extends React.Component<Props, State> {
  render() {
    return (
      <>
        <Notifications />
        <Floats />
        <Translator
          apiUrl={process.env.NEXT_PUBLIC_MADY_BACKEND_URL || ''}
          height={0} /* full-height */
        />
      </>
    );
  }
}

// ==============================================
// Public
// ==============================================
export default App;
