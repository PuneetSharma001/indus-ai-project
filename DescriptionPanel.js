import React from 'react';

function DescriptionPanel({ description }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>DESCRIPTION</h3>
      </div>
      <div className="panel-content">
        {description ? (
          <p>{description.description || description}</p>
        ) : (
          <p>AI insights will appear here...</p>
        )}
      </div>
    </div>
  );
}

export default DescriptionPanel;