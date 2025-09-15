import React, { useState } from 'react';

function SQLDropdown({ sql }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <span>View Generated SQL (Dropdown)</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-content">
          {sql && sql.sql_query ? (
            <div className="sql-container">
              <div className="sql-info">
                <p>Query Safety: {sql.is_safe ? '✅ Safe' : '⚠️ Potentially unsafe'}</p>
                {sql.retry_attempts > 0 && <p>Retry attempts: {sql.retry_attempts}</p>}
              </div>
              <div className="sql-code">
                <pre><code>{sql.sql_query}</code></pre>
              </div>
            </div>
          ) : (
            <p>No SQL query available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SQLDropdown;