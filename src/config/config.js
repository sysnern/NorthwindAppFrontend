// Environment configuration
const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7137',
    timeout: 10000,
  },
  
  // App Configuration
  app: {
    name: 'Northwind App',
    version: '1.0.0',
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  
  // Pagination Options
  pagination: {
    pageSizes: [10],
  },
  
  // Toast Configuration
  toast: {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  },
};

export default config; 