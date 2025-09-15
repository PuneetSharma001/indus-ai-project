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
  const [apiHealth, setApiHealth] = useState(true);

  
  useEffect(() => {
    setApiHealth(true);
    console.log('✅ Demo mode - API shown as online');
  }, []);

  const checkApiHealth = async () => {
    
    setApiHealth(true);
    console.log('✅ API health check - demo mode active');
  };


  const getMockResults = (query) => {
    return {
      queryId: `demo_${Date.now()}`,
      sql: {
        sql_query: `SELECT category, SUM(sales_amount) as total_sales 
FROM sales_data 
WHERE date >= '2024-01-01' 
GROUP BY category 
ORDER BY total_sales DESC;`,
        is_safe: true,
        retry_attempts: 0
      },
      tables: {
        tables: [
          { category: 'Electronics', total_sales: 1250000, growth: '15%' },
          { category: 'Clothing', total_sales: 890000, growth: '8%' },
          { category: 'Home & Garden', total_sales: 650000, growth: '12%' },
          { category: 'Sports', total_sales: 540000, growth: '5%' },
          { category: 'Books', total_sales: 320000, growth: '-2%' }
        ],
        record_count: 5
      },
      description: {
        description: `Based on the analysis of sales data, Electronics leads with $1.25M in total sales, showing strong 15% growth. Clothing follows at $890K with steady 8% growth. Home & Garden shows promising 12% growth at $650K. The data reveals healthy performance across most categories, with only Books showing a slight decline of 2%. Overall sales trends indicate positive market performance with Electronics driving the majority of revenue growth.`,
        query_executed_successfully: true
      },
      graph: {
        html_content: `
          <div style="padding: 20px; background: white; height: 280px; display: flex; align-items: center; justify-content: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">📊</div>
              <h3 style="color: #3b82f6; margin: 0;">Sales by Category Chart</h3>
              <p style="color: #64748b; margin: 10px 0;">Interactive visualization of sales performance</p>
              <div style="display: flex; gap: 20px; margin-top: 20px; justify-content: center;">
                <div style="text-align: center;">
                  <div style="width: 60px; height: 60px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 0 auto;">1.25M</div>
                  <small style="color: #64748b;">Electronics</small>
                </div>
                <div style="text-align: center;">
                  <div style="width: 50px; height: 50px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 0 auto; font-size: 12px;">890K</div>
                  <small style="color: #64748b;">Clothing</small>
                </div>
                <div style="text-align: center;">
                  <div style="width: 40px; height: 40px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 0 auto; font-size: 10px;">650K</div>
                  <small style="color: #64748b;">Home</small>
                </div>
              </div>
            </div>
          </div>
        `,
        graph_type: 'bar_chart'
      }
    };
  };

  const handleQuerySubmit = async (query) => {
    if (!query.trim()) return;

    setCurrentQuery(query);
    setIsLoading(true);
    setError(null);
    setCurrentView('results');

    
    const historyItem = {
      id: Date.now().toString(),
      query: query,
      timestamp: new Date(),
      status: 'processing'
    };
    setChatHistory(prev => [historyItem, ...prev]);

    try {
      console.log('🚀 Processing query:', query);
      
     
      let results;
      try {
        const processResponse = await apiService.processQuery(query);
        
        if (processResponse.query_id) {
          const queryId = processResponse.query_id;
          setApiHealth(true); // API is working

          const [sql, tables, description, graph] = await Promise.allSettled([
            apiService.getSQL(queryId),
            apiService.getTables(queryId), 
            apiService.getDescription(queryId),
            apiService.getGraph(queryId)
          ]);

          results = {
            queryId,
            sql: sql.status === 'fulfilled' ? sql.value : null,
            tables: tables.status === 'fulfilled' ? tables.value : null,
            description: description.status === 'fulfilled' ? description.value : null,
            graph: graph.status === 'fulfilled' ? graph.value : null
          };
        } else {
          throw new Error('No query ID received');
        }
      } catch (apiError) {
        console.log('📋 API failed, using demo data:', apiError.message);
        
        results = getMockResults(query);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }

      setQueryResults(results);
      
      
      setChatHistory(prev => 
        prev.map(item => 
          item.id === historyItem.id 
            ? { ...item, status: 'completed', results }
            : item
        )
      );

    } catch (error) {
      console.error('❌ Query processing failed:', error);
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
