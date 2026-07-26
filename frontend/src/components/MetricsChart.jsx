import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTimeSeries } from '../api/fetchMetrics';

const MetricsChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTimeSeries();
      
      // Format the SQL time-buckets for the X-axis
      const formattedData = data.map(item => ({
        time: new Date(item.time_bucket).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: parseInt(item.avg_latency) || 0,
        errors: parseInt(item.error_count) || 0
      }));
      
      // Reverse so the graph reads chronologically left-to-right
      setChartData(formattedData.reverse());
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: 400, width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Live Network Latency & Security Anomalies</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Errors', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#3498db" activeDot={{ r: 8 }} name="Avg Latency (ms)" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#e74c3c" name="5xx Errors / Dropped Packets" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;