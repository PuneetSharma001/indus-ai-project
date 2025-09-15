import React from 'react';
import QueryInput from './QueryInput';
import DescriptionPanel from './DescriptionPanel';
import ChartPanel from './ChartPanel';
import DataTableDropdown from './DataTableDropdown';
import SQLDropdown from './SQLDropdown';

function ResultsPage({ query, results, isLoading, error, onQuerySubmit, apiHealth }) {
  return (
    <div className="results-page">
      <div className="results-header">
        <div className="user-query">
          <div className="query-label">USER QUERY</div>
          <div className="query-text">{query}</div>
        </div>
        {!apiHealth && (
          <div className="api-warning">
            ⚠️ API offline - Showing demo data
          </div>
        )}
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing your query...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={() => onQuerySubmit(query)}>Try Again</button>
        </div>
      )}

      {!isLoading && !error && results && (
        <div className="results-content">
          <div className="results-grid">
            <DescriptionPanel description={results.description} />
            <ChartPanel graph={results.graph} />
          </div>

          <div className="dropdowns">
            <DataTableDropdown tables={results.tables} />
            <SQLDropdown sql={results.sql} />
          </div>
        </div>
      )}

      <div className="results-footer">
        <QueryInput onSubmit={onQuerySubmit} placeholder="ASK ANYTHING" />
      </div>
    </div>
  );
}

export default ResultsPage;