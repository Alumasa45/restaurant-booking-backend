import axios from 'axios';

/**
 * Configured axios instance for API calls
 * Handles auth token management and error handling
 */

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust to your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Initialize authorization header with existing token
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor - adds auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Get the latest token for each request (in case it changed)
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      // Format: "Bearer [token]"
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
      
      // Debug headers only when needed
      if (config.url.includes('/admin')) {
        console.log('Request headers:', config.headers);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    // Process successful responses
    return response;
  },
  (error) => {
    // Process response errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401: // Unauthorized
          console.error('Authentication error: Token invalid or expired');
          // Could dispatch an action to logout or redirect to login
          localStorage.removeItem('token');
          // window.location.href = '/login'; // Uncomment to redirect
          break;
          
        case 403: // Forbidden
          console.error('Authorization error: Insufficient permissions');
          console.log('Response data:', data);
          // Log additional details to help debug permission issues
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('Current token payload:', payload);
              console.log('User roles:', payload.roles || payload.role || 'No role information');
            } catch (e) {
              console.error('Error parsing token:', e);
            }
          }
          break;
          
        case 404: // Not found
          console.error('Resource not found:', error.config.url);
          break;
          
        case 500: // Server error
          console.error('Server error:', data);
          break;
          
        default:
          console.error(`API error (${status}):`, data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error in setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;