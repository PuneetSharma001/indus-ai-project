import React, { useState } from 'react';

function QueryInput({ onSubmit, placeholder }) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="query-input-container">
      <input 
        type="text"
        className="query-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="query-submit" onClick={handleSubmit}>
        ➤
      </button>
    </div>
  );
}

export default QueryInput;