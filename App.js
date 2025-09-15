import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import ResultsPage from './components/ResultsPage';
import { apiService } from './services/api';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [apiHealth, setApiHealth] = useState(false);

  // Check API health when app starts
  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch('https://c1cf3eab158d.ngrok-free.app/health', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      setApiHealth(data.status === 'healthy');
      console.log('API Health:', data.status);
    } catch (error) {
      setApiHealth(false);
      console.log('API Health Check Failed:', error.message);
    }
  };

  const handleQuerySubmit = async (query) => {
    if (!query.trim()) return;

    setCurrentQuery(query);
    setIsLoading(true);
    setError(null);
    setCurrentView('results');

    // Add to history  
    const historyItem = {
      id: Date.now().toString(),
      query: query,
      timestamp: new Date(),
      status: 'processing'
    };
    setChatHistory(prev => [historyItem, ...prev]);

    try {
      // Step 1: Process query
      const processResponse = await apiService.processQuery(query);

      if (!processResponse.query_id) {
        throw new Error('No query ID received');
      }

      const queryId = processResponse.query_id;
      setApiHealth(true); // API is working

      // Step 2: Get all results
      const [sql, tables, description, graph] = await Promise.allSettled([
        apiService.getSQL(queryId),
        apiService.getTables(queryId), 
        apiService.getDescription(queryId),
        apiService.getGraph(queryId)
      ]);

      const results = {
        queryId,
        sql: sql.status === 'fulfilled' ? sql.value : null,
        tables: tables.status === 'fulfilled' ? tables.value : null,
        description: description.status === 'fulfilled' ? description.value : null,
        graph: graph.status === 'fulfilled' ? graph.value : null
      };

      setQueryResults(results);

      // Update history
      setChatHistory(prev => 
        prev.map(item => 
          item.id === historyItem.id 
            ? { ...item, status: 'completed', results }
            : item
        )
      );

    } catch (error) {
      setError(error.message);
      setChatHistory(prev => 
        prev.map(item => 
          item.id === historyItem.id 
            ? { ...item, status: 'error', error: error.message }
            : item
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentView('landing');
    setCurrentQuery('');
    setQueryResults(null);
    setError(null);
  };

  const handleHistoryClick = (item) => {
    if (item.status === 'completed' && item.results) {
      setCurrentQuery(item.query);
      setQueryResults(item.results);
      setCurrentView('results');
      setError(null);
    }
  };

  return (
    <div className="app">
      <Sidebar 
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onHistoryClick={handleHistoryClick}
        apiHealth={apiHealth}
      />

      <main className="main-content">
        {currentView === 'landing' ? (
          <LandingPage 
            onQuerySubmit={handleQuerySubmit}
            apiHealth={apiHealth}
          />
        ) : (
          <ResultsPage 
            query={currentQuery}
            results={queryResults}
            isLoading={isLoading}
            error={error}
            onQuerySubmit={handleQuerySubmit}
            apiHealth={apiHealth}
          />
        )}
      </main>
    </div>
  );
}

export default App;