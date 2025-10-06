import React, { useEffect, useState } from 'react';

const AdminDashboardSimple = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    entryStocks: [],
    breakoutStocks: [],
    screenings: []
  });
  const [debugInfo, setDebugInfo] = useState([]);

  const addDebug = (message) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebug('Component mounted, starting data fetch...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      addDebug('Fetching entry zone stocks...');
      const entryRes = await fetch('/admin/api/entry-zone-stocks');
      addDebug(`Entry response status: ${entryRes.status}`);
      const entryData = await entryRes.json();
      addDebug(`Entry data received: ${JSON.stringify(entryData).substring(0, 100)}...`);

      addDebug('Fetching breakout stocks...');
      const breakoutRes = await fetch('/admin/api/breakout-stocks');
      addDebug(`Breakout response status: ${breakoutRes.status}`);
      const breakoutData = await breakoutRes.json();
      addDebug(`Breakout data received: ${JSON.stringify(breakoutData).substring(0, 100)}...`);

      addDebug('Fetching screenings...');
      const screeningsRes = await fetch('/admin/api/stock-screenings');
      addDebug(`Screenings response status: ${screeningsRes.status}`);
      const screeningsData = await screeningsRes.json();
      addDebug(`Screenings data received: ${JSON.stringify(screeningsData).substring(0, 100)}...`);

      setData({
        entryStocks: entryData.stocks || [],
        breakoutStocks: breakoutData.stocks || [],
        screenings: screeningsData.screenings || []
      });

      addDebug(`✅ Data loaded successfully! Entry: ${entryData.stocks?.length || 0}, Breakout: ${breakoutData.stocks?.length || 0}, Screenings: ${screeningsData.screenings?.length || 0}`);
    } catch (error) {
      addDebug(`❌ Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
      addDebug('Loading complete!');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Admin Dashboard - Simple Debug Version</h1>
        <p>Loading data...</p>
        <div style={{ backgroundColor: '#f0f0f0', padding: 10, marginTop: 20, fontFamily: 'monospace', fontSize: 12 }}>
          <h3>Debug Log:</h3>
          {debugInfo.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    );
  }

  const allStocks = [...data.entryStocks, ...data.breakoutStocks];
  
  // Calculate industry breakdown
  const industryMap = {};
  allStocks.forEach(stock => {
    const industry = stock.industry || 'Unknown';
    industryMap[industry] = (industryMap[industry] || 0) + 1;
  });

  const industries = Object.entries(industryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: '#333' }}>Admin Dashboard - Simple Debug Version</h1>
      
      {/* Debug Section */}
      <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', padding: 15, marginBottom: 20, borderRadius: 5 }}>
        <h3 style={{ margin: 0, marginBottom: 10 }}>🔍 Debug Information</h3>
        <div style={{ fontFamily: 'monospace', fontSize: 12, maxHeight: 200, overflow: 'auto' }}>
          {debugInfo.map((log, idx) => (
            <div key={idx} style={{ marginBottom: 5 }}>{log}</div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
        <div style={{ backgroundColor: '#e3f2fd', padding: 20, borderRadius: 8, border: '2px solid #2196f3' }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Total Stocks</h3>
          <p style={{ fontSize: 36, fontWeight: 'bold', color: '#1976d2', margin: '10px 0 0 0' }}>
            {allStocks.length}
          </p>
        </div>
        <div style={{ backgroundColor: '#e8f5e9', padding: 20, borderRadius: 8, border: '2px solid #4caf50' }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Entry Zone</h3>
          <p style={{ fontSize: 36, fontWeight: 'bold', color: '#388e3c', margin: '10px 0 0 0' }}>
            {data.entryStocks.length}
          </p>
        </div>
        <div style={{ backgroundColor: '#fff3e0', padding: 20, borderRadius: 8, border: '2px solid #ff9800' }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Breakout</h3>
          <p style={{ fontSize: 36, fontWeight: 'bold', color: '#f57c00', margin: '10px 0 0 0' }}>
            {data.breakoutStocks.length}
          </p>
        </div>
      </div>

      {/* Simple Bar Chart (CSS-based) */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: 20 }}>
        <h2 style={{ marginTop: 0 }}>📊 Top Industries (CSS Bar Chart)</h2>
        {industries.length === 0 ? (
          <p style={{ color: '#999' }}>No industry data available</p>
        ) : (
          <div>
            {industries.map(([industry, count]) => (
              <div key={industry} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ width: 150, fontWeight: 'bold' }}>{industry}:</span>
                  <div style={{ 
                    flex: 1, 
                    height: 30, 
                    backgroundColor: '#2196f3', 
                    width: `${(count / Math.max(...industries.map(i => i[1]))) * 100}%`,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 10,
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entry Zone Table */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: 20 }}>
        <h2 style={{ marginTop: 0, color: '#4caf50' }}>✅ Entry Zone Stocks ({data.entryStocks.length})</h2>
        {data.entryStocks.length === 0 ? (
          <p style={{ color: '#999' }}>No entry zone stocks available</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Symbol</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Industry</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>Market Cap</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {data.entryStocks.slice(0, 10).map((stock, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: 10, fontWeight: 'bold' }}>{stock.symbol}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{stock.industry || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>{stock.total_market_cap_formatted || stock.market_cap || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>{stock.latest_volume?.toLocaleString() || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Breakout Table */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: 20 }}>
        <h2 style={{ marginTop: 0, color: '#ff9800' }}>🚀 Breakout Stocks ({data.breakoutStocks.length})</h2>
        {data.breakoutStocks.length === 0 ? (
          <p style={{ color: '#999' }}>No breakout stocks available</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Symbol</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Industry</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>Market Cap</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {data.breakoutStocks.slice(0, 10).map((stock, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: 10, fontWeight: 'bold' }}>{stock.symbol}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{stock.industry || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>{stock.total_market_cap_formatted || stock.market_cap || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>{stock.latest_volume?.toLocaleString() || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Screenings */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>📋 Stock Screenings ({data.screenings.length})</h2>
        {data.screenings.length === 0 ? (
          <p style={{ color: '#999' }}>No screenings available</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'center' }}>Stocks</th>
              </tr>
            </thead>
            <tbody>
              {data.screenings.map((screening, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{screening.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{new Date(screening.created_at).toLocaleDateString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10, textAlign: 'center' }}>{screening.results_data?.stocks?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Raw Data Display */}
      <details style={{ marginTop: 30, backgroundColor: '#f5f5f5', padding: 15, borderRadius: 5 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔍 Show Raw Data (Click to expand)</summary>
        <pre style={{ fontSize: 11, overflow: 'auto', maxHeight: 400, marginTop: 10 }}>
          {JSON.stringify({
            entryStocks: data.entryStocks,
            breakoutStocks: data.breakoutStocks,
            screenings: data.screenings
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default AdminDashboardSimple;
