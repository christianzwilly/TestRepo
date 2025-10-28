// JSX File: OCBC Themed Investment Onboarding Flow (Web + Mobile Toggle)
// Uploaded via ChatGPT automation for initial commit

import React, { useState } from 'react';

export default function OcbcThemedInvestmentOnboardingFlow() {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <div style={{ padding: 20 }}>
      <h1>OCBC Themed Investment Onboarding Flow</h1>
      <p>Device mode: {isMobile ? 'Mobile' : 'Web'}</p>
      <button onClick={() => setIsMobile(!isMobile)}>Toggle Mode</button>
    </div>
  );
}