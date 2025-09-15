import React from 'react';
import QueryInput from './QueryInput';
import SampleQueries from './SampleQueries';

function LandingPage({ onQuerySubmit, apiHealth }) {
  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1>AI BUSINESS ANALYTICS</h1>
        {!apiHealth && (
          <div className="api-warning">
            ⚠️ API is offline - Demo mode active
          </div>
        )}
      </div>

      <SampleQueries onQuerySubmit={onQuerySubmit} />

      <div className="landing-footer">
        <QueryInput onSubmit={onQuerySubmit} placeholder="ASK ANYTHING" />
      </div>
    </div>
  );
}

export default LandingPage;