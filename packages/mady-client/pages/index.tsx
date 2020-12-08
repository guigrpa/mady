import React from 'react';
import { Translator } from 'mady-client-components';
import { Notifications } from 'giu';

// ==============================================
// Component
// ==============================================
const App = () => (
  <>
    <Notifications />
    <Translator apiUrl={process.env.NEXT_PUBLIC_MADY_BACKEND_URL || ''} />
  </>
);

// ==============================================
// Public
// ==============================================
export default App;
