import React from 'react';

const SAMPLE_QUERIES = [
  "Show total sales by category",
  "What are the top performing products this quarter?",
  "Analyze customer retention rates by region"
];

function SampleQueries({ onQuerySubmit }) {
  return (
    <div className="sample-queries">
      <h2>TRY ASKING:</h2>
      <div className="query-buttons">
        {SAMPLE_QUERIES.map((query, index) => (
          <button 
            key={index}
            className="sample-query-btn"
            onClick={() => onQuerySubmit(query)}
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SampleQueries;