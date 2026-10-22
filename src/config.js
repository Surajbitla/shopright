// In your config.js or environment-specific configuration
const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000', // For local development
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://3.85.84.185/api', // For production
  },
};

export default config;
