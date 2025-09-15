import React from 'react';
import '../styles/App.css';

function Sidebar({ chatHistory, onNewChat, onHistoryClick, apiHealth }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>Analytics AI</span>
        </div>

        <div className={`api-status ${apiHealth ? 'online' : 'offline'}`}>
          <div className="status-dot"></div>
          <span>{apiHealth ? 'API Online' : 'API Offline'}</span>
        </div>
      </div>

      <div className="sidebar-content">
        <button className="new-chat-btn" onClick={onNewChat}>
          NEW CHAT
        </button>

        <div className="chat-history">
          <h3>CHAT HISTORY</h3>
          {chatHistory.length === 0 ? (
            <p className="no-history">No previous queries</p>
          ) : (
            chatHistory.map(item => (
              <div 
                key={item.id}
                className={`history-item ${item.status}`}
                onClick={() => onHistoryClick(item)}
              >
                <div className="history-query">
                  {item.query.length > 40 ? `${item.query.substring(0, 40)}...` : item.query}
                </div>
                <div className="history-meta">
                  <span className="history-time">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="history-status">
                    {item.status === 'processing' && '⏳'}
                    {item.status === 'completed' && '✅'}
                    {item.status === 'error' && '❌'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;