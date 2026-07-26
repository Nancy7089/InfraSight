-- Create the main table for storing API telemetry data
CREATE TABLE IF NOT EXISTS api_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index the timestamp column 
-- Why: The Node.js time-series route groups data by minute. This index makes that query lightning fast.
CREATE INDEX IF NOT EXISTS idx_timestamp ON api_logs(timestamp);

-- Index the endpoint column
-- Why: The Node.js summary route groups data by endpoint. This index prevents full-table scans.
CREATE INDEX IF NOT EXISTS idx_endpoint ON api_logs(endpoint);