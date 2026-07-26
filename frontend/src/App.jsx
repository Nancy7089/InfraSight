import React, { useState, useEffect } from 'react';
import MetricsChart from './components/MetricsChart';
import { getSummary } from './api/fetchMetrics';
import './App.css'; 

function App() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await getSummary();
      setMetrics(data);
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>InfraSight: System Health</h1>
      
      {/* Render the live time-series chart */}
      <MetricsChart />
      
      {/* Render the summary metrics table */}
      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Total Requests</th>
            <th>Avg Latency (ms)</th>
            <th>Server Errors</th>
            <th>Health Status</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((row, index) => (
            <tr key={index}>
              <td>{row.endpoint}</td>
              <td>{row.total_requests}</td>
              <td>{row.avg_latency_ms}</td>
              <td style={{ color: row.error_count > 0 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                {row.error_count}
              </td>
              <td>
                {row.avg_latency_ms > 1000 || row.error_count > 5 
                  ? '⚠️ Warning' 
                  : '✅ Healthy'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;


// grep ' 401 ' /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr