import React, { useState } from 'react';

function DataTableDropdown({ tables }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <span>View Data Table (Dropdown)</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-content">
          {tables && tables.tables && tables.tables.length > 0 ? (
            <div className="table-container">
              <p>Records found: {tables.record_count || tables.tables.length}</p>
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(tables.tables[0]).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tables.tables.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex}>{value !== null ? value : 'N/A'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {tables.tables.length > 10 && (
                <p>Showing first 10 of {tables.tables.length} records</p>
              )}
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTableDropdown;