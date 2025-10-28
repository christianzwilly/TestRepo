import { optimizeParams } from './ocbc_fix_safe_optimizeParams';

// inside your JSX component where optimizeParams is used:
// replace the inline optimizeParams function with imported one
// Example:
// import React from 'react';
// import { optimizeParams } from './ocbc_fix_safe_optimizeParams';

// then simply call optimizeParams({...})

export default function OcbcThemedInvestmentOnboardingFlow() {
  // use optimizeParams safely
  const result = optimizeParams({ target: 100000, initial: 5000, recurring: 500, years: 10, r: 0.06 });
  console.log(result);
  return <div>Flow updated to use safe optimizeParams</div>;
}