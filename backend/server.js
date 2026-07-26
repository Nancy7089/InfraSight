require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import your modular routes
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(cors()); // Allows your React app to fetch data
app.use(express.json());

// Register your routes
app.use('/api/analytics', analyticsRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});