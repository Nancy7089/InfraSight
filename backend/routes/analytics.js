const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: /api/analytics/summary
// Calculates the table data: totals, averages, and errors per endpoint
router.get('/summary', async (req, res) => {
  try {
    const query = `
      SELECT 
        endpoint,
        COUNT(*) as total_requests,
        ROUND(AVG(response_time_ms)) as avg_latency_ms,
        SUM(CASE WHEN status_code >= 500 THEN 1 ELSE 0 END) as error_count
      FROM api_logs
      GROUP BY endpoint
      ORDER BY error_count DESC, avg_latency_ms DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// GET: /api/analytics/timeseries
// Calculates the line chart data: groups metrics into 1-minute buckets
router.get('/timeseries', async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE_TRUNC('minute', timestamp) AS time_bucket,
        ROUND(AVG(response_time_ms)) AS avg_latency,
        SUM(CASE WHEN status_code >= 500 THEN 1 ELSE 0 END) AS error_count
      FROM api_logs
      GROUP BY time_bucket
      ORDER BY time_bucket DESC
      LIMIT 15;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching timeseries:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;