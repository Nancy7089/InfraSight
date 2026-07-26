1. Why This Project? (The Business Value)
In modern enterprise environments, companies rely on hundreds of microservices. When a system goes down or slows down, the business loses money, customers, and reputation.

InfraSight solves a critical business problem: System Visibility.

Proactive Incident Management: Instead of waiting for users to complain on Twitter that a website is down, InfraSight visualizes 5xx server errors and latency spikes in real-time. This allows engineering teams to detect and fix bottlenecks before they cause a complete outage.

SLA Monitoring: Businesses have Service Level Agreements (SLAs) promising certain speeds and uptimes. InfraSight’s summary table tracks the exact average latency and total requests per endpoint, providing hard data to prove SLA compliance.

Resource Allocation: By identifying which endpoints handle the most traffic, businesses know exactly where to allocate more server resources (scaling) and where they can cut costs.



2. Why Python and Node.js Together?
Using two different backend languages is a classic microservice pattern. It demonstrates an understanding of choosing the "right tool for the right job."

Python (The Data Engine): Python is the industry standard for Data Engineering, ETL (Extract, Transform, Load) pipelines, and machine learning. In this project, Python acts as the heavy-lifting worker script. It handles the continuous generation, transformation, and ingestion of data into the database. If you ever wanted to add predictive AI to forecast network crashes, Python makes that seamless.

Node.js (The API Server): Node.js is built on an event-driven, non-blocking I/O model. This makes it incredibly efficient at handling thousands of simultaneous, lightweight read requests. While Python handles writing heavy data in the background, Node.js serves the real-time analytics to the React dashboard instantly without getting blocked by the database writes.



3. Detailed Architecture Flow
Here is the step-by-step journey of a single piece of data through your system:

Generation (Python): The Python script generates a simulated network event (e.g., a user hitting the /api/payment endpoint). It calculates a fake latency and status code.

Ingestion (Python -> DB): Python executes an INSERT SQL command, pushing this log into the PostgreSQL api_logs table.

Storage & Indexing (PostgreSQL): The database stores the row. Because we added indexes to the timestamp and endpoint columns, the database automatically organizes this data for hyper-fast retrieval.

Aggregation (Node.js <- DB): Every 5 seconds, the Node.js server receives a request from the frontend. It runs advanced SQL queries (GROUP BY, DATE_TRUNC, AVG, SUM) to crush thousands of raw logs into a few clean metrics.

Delivery (Node.js -> React): Node.js sends this calculated data via a JSON API response over HTTP.

Visualization (React): The React frontend receives the JSON. Recharts maps the time-series data to the X and Y axes of the line chart, and the table maps the summary data, instantly updating the UI.



4. File Directory & Core Functions Breakdown
🗄️ Database Tier
database/schema.sql

Role: The blueprint of your data structure.

Main Commands: CREATE TABLE (defines columns like response_time_ms and status_code) and CREATE INDEX (optimizes read speeds for time-based and endpoint-based queries).

⚙️ Data Engine Tier
data-engine/ingestor.py

Role: Acts as the simulated network environment.

Main Logic/Functions: Uses a while True: loop to continuously generate mock traffic. It utilizes database connector libraries (like psycopg2) to execute cursor.execute() and connection.commit() to write the raw telemetry to PostgreSQL.

🌐 Backend API Tier (Node.js)
backend/config/db.js

Role: Manages the connection to PostgreSQL securely.

Main Functions: new Pool() initializes a pool of reusable database connections. pool.query('SELECT 1') tests the connection on startup to ensure the backend doesn't silently fail.

backend/routes/analytics.js

Role: The brain of the API. It holds the business logic and SQL algorithms.

Main Functions:

router.get('/summary'): Executes the SQL query to calculate total requests, average latency, and error counts grouped by endpoint.

router.get('/timeseries'): Executes the SQL query using DATE_TRUNC to group the raw data into 1-minute chronological buckets for the line chart.

backend/server.js

Role: The entry point that boots the Express web server.

Main Functions: app.use(cors()) applies security headers allowing React to talk to Node. app.listen() binds the server to port 5001.

💻 Frontend Tier (React)
frontend/src/api/fetchMetrics.js

Role: The dedicated HTTP client. It abstracts all network logic away from the UI.

Main Functions: axios.get() sends asynchronous requests to the Node.js API to fetch the summary and timeseries JSON arrays.

frontend/src/components/MetricsChart.jsx

Role: Visualizes the chronological health of the network.

Main Functions: Uses a useEffect hook with setInterval() to trigger the API fetch every 5 seconds. It utilizes <LineChart>, <XAxis>, and <Line> components from Recharts to draw the live latency and error data.

frontend/src/App.jsx

Role: The master layout and state manager.

Main Functions: Holds the metrics state for the table. Maps over the API data using {metrics.map()} to dynamically render the <tr> and <td> HTML elements for the summary table. Applies conditional formatting (making text red if errors are > 0).
