import axios from 'axios';

// Point this to your Node.js server port
const API_BASE_URL = 'http://localhost:5001/api/analytics';

export const getSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching summary metrics:", error);
    return [];
  }
};

export const getTimeSeries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/timeseries`);
    return response.data;
  } catch (error) {
    console.error("Error fetching time-series data:", error);
    return [];
  }
};