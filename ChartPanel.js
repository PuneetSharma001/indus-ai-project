import React from 'react';

function ChartPanel({ graph }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>CHARTS</h3>
      </div>
      <div className="panel-content">
        {graph && graph.html_content ? (
          <div className="chart-container">
            <iframe 
              srcDoc={graph.html_content}
              style={{ width: '100%', height: '300px', border: 'none' }}
              title="Data Visualization"
            />
          </div>
        ) : (
          <div className="chart-placeholder">
            <p>📊 Chart visualization will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartPanel;