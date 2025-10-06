import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StockScreeningDetail from './StockScreeningDetail';

const AdminDashboard = () => {
  const [screenings, setScreenings] = useState([]);
  const [selectedScreeningId, setSelectedScreeningId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entryStocks, setEntryStocks] = useState([]);
  const [breakoutStocks, setBreakoutStocks] = useState([]);
  const [stats, setStats] = useState({
    totalStocks: 0,
    entryCount: 0,
    breakoutCount: 0,
    avgMarketCap: 0,
    avgVolume: 0
  });
  const [industryData, setIndustryData] = useState([]);
  const [marketCapData, setMarketCapData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch screenings
      const screeningsRes = await fetch('/admin/api/stock-screenings');
      const screeningsData = await screeningsRes.json();
      if (screeningsData.success) {
        setScreenings(screeningsData.screenings || []);
      }

      // Fetch entry zone stocks
      const entryRes = await fetch('/admin/api/entry-zone-stocks');
      const entryData = await entryRes.json();
      if (entryData.success) {
        setEntryStocks(entryData.stocks || []);
      }

      // Fetch breakout stocks
      const breakoutRes = await fetch('/admin/api/breakout-stocks');
      const breakoutData = await breakoutRes.json();
      if (breakoutData.success) {
        setBreakoutStocks(breakoutData.stocks || []);
      }

      // Calculate statistics and prepare chart data
      const allStocks = [...(entryData.stocks || []), ...(breakoutData.stocks || [])];
      calculateStats(allStocks, entryData.stocks || [], breakoutData.stocks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allStocks, entry, breakout) => {
    console.log('Calculating stats for:', { allStocks, entry, breakout });
    // Calculate stats
    const totalStocks = allStocks.length;
    const entryCount = entry.length;
    const breakoutCount = breakout.length;

    // Calculate average market cap and volume
    const avgMarketCap = allStocks.length > 0
      ? allStocks.reduce((sum, s) => sum + parseFloat(s.market_cap || 0), 0) / allStocks.length
      : 0;
    
    const avgVolume = allStocks.length > 0
      ? allStocks.reduce((sum, s) => sum + parseFloat(s.latest_volume || 0), 0) / allStocks.length
      : 0;

    setStats({
      totalStocks,
      entryCount,
      breakoutCount,
      avgMarketCap,
      avgVolume
    });

    // Industry breakdown
    const industryMap = {};
    allStocks.forEach(stock => {
      const industry = stock.industry || 'Unknown';
      if (!industryMap[industry]) {
        industryMap[industry] = 0;
      }
      industryMap[industry]++;
    });

    const industryChartData = Object.keys(industryMap).map(industry => ({
      name: industry,
      count: industryMap[industry]
    })).sort((a, b) => b.count - a.count).slice(0, 10);

    console.log('Industry chart data:', industryChartData);
    setIndustryData(industryChartData);

    // Market cap distribution
    const marketCapRanges = {
      'Small (<$2B)': 0,
      'Mid ($2B-$10B)': 0,
      'Large ($10B-$200B)': 0,
      'Mega (>$200B)': 0
    };

    allStocks.forEach(stock => {
      const marketCap = parseFloat(stock.market_cap || 0);
      if (marketCap < 2e9) {
        marketCapRanges['Small (<$2B)']++;
      } else if (marketCap < 10e9) {
        marketCapRanges['Mid ($2B-$10B)']++;
      } else if (marketCap < 200e9) {
        marketCapRanges['Large ($10B-$200B)']++;
      } else {
        marketCapRanges['Mega (>$200B)']++;
      }
    });

    const marketCapChartData = Object.keys(marketCapRanges).map(range => ({
      name: range,
      value: marketCapRanges[range]
    }));

    console.log('Market cap chart data:', marketCapChartData);
    setMarketCapData(marketCapChartData);
  };

  const formatCurrency = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(0);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D', '#C9C9FF', '#FFD700'];

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard data...</div>;
  if (error) return <div style={{ color: 'red', padding: 20 }}>Error: {error}</div>;

  if (selectedScreeningId) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setSelectedScreeningId(null)} style={{ marginBottom: 16, padding: '8px 16px', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
        <StockScreeningDetail screeningId={selectedScreeningId} />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 30, color: '#333' }}>Admin Dashboard</h1>

      {/* Summary Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#666' }}>Total Stocks</h3>
          <p style={{ fontSize: 32, fontWeight: 'bold', color: '#0088FE', margin: '10px 0 0 0' }}>{stats.totalStocks}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#666' }}>Entry Zone Stocks</h3>
          <p style={{ fontSize: 32, fontWeight: 'bold', color: '#00C49F', margin: '10px 0 0 0' }}>{stats.entryCount}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#666' }}>Breakout Stocks</h3>
          <p style={{ fontSize: 32, fontWeight: 'bold', color: '#FFBB28', margin: '10px 0 0 0' }}>{stats.breakoutCount}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#666' }}>Avg Market Cap</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: '#FF8042', margin: '10px 0 0 0' }}>{formatCurrency(stats.avgMarketCap)}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#666' }}>Avg Volume</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: '#8884D8', margin: '10px 0 0 0' }}>{formatNumber(stats.avgVolume)}</p>
        </div>
      </div>

      {/* Debug Info */}
      {console.log('Rendering charts. Industry data:', industryData, 'Market cap data:', marketCapData)}

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 30 }}>
        {/* Industry Distribution Chart */}
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Top Industries ({industryData.length} industries)</h3>
          {industryData.length === 0 ? (
            <p style={{ color: '#999', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No industry data available</p>
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Market Cap Distribution Chart */}
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Market Cap Distribution</h3>
          {marketCapData.length === 0 || marketCapData.every(d => d.value === 0) ? (
            <p style={{ color: '#999', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No market cap data available</p>
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketCapData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {marketCapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Entry Zone Stocks Table */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: 20 }}>
        <h2 style={{ marginTop: 0, color: '#00C49F' }}>Entry Zone Stocks ({entryStocks.length})</h2>
        {entryStocks.length === 0 ? (
          <p style={{ color: '#999' }}>No entry zone stocks available.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'left' }}>Symbol</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'left' }}>Industry</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>Market Cap</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {entryStocks.slice(0, 10).map((stock, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, fontWeight: 'bold' }}>{stock.symbol}</td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12 }}>{stock.industry || 'N/A'}</td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>{stock.total_market_cap_formatted || 'N/A'}</td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>{formatNumber(stock.latest_volume || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entryStocks.length > 10 && (
              <p style={{ marginTop: 10, color: '#666', fontSize: 14 }}>Showing 10 of {entryStocks.length} stocks</p>
            )}
          </div>
        )}
      </div>

      {/* Breakout Stocks Table */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: 20 }}>
        <h2 style={{ marginTop: 0, color: '#FFBB28' }}>Breakout Stocks ({breakoutStocks.length})</h2>
        {breakoutStocks.length === 0 ? (
          <p style={{ color: '#999' }}>No breakout stocks available.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'left' }}>Symbol</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'left' }}>Industry</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>Market Cap</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {breakoutStocks.slice(0, 10).map((stock, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, fontWeight: 'bold' }}>{stock.symbol}</td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12 }}>{stock.industry || 'N/A'}</td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>{stock.total_market_cap_formatted || 'N/A'}</td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'right' }}>{formatNumber(stock.latest_volume || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {breakoutStocks.length > 10 && (
              <p style={{ marginTop: 10, color: '#666', fontSize: 14 }}>Showing 10 of {breakoutStocks.length} stocks</p>
            )}
          </div>
        )}
      </div>

      {/* Stock Screenings Table */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>Stock Screenings</h2>
        {screenings.length === 0 ? (
          <p style={{ color: '#999' }}>No screenings found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'left' }}>Name</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'left' }}>Date</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'center' }}>Stocks Count</th>
                  <th style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {screenings.map((screening, idx) => (
                  <tr key={screening.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                    <td style={{ border: '1px solid #dee2e6', padding: 12 }}>{screening.name}</td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12 }}>
                      {new Date(screening.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'center' }}>
                      {screening.results_data?.stocks?.length || 0}
                    </td>
                    <td style={{ border: '1px solid #dee2e6', padding: 12, textAlign: 'center' }}>
                      <button 
                        onClick={() => setSelectedScreeningId(screening.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#0088FE',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
