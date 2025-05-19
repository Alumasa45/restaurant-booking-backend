// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Store the JWT token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Retrieve the JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Remove the token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Add auth token to request headers
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Login user
// filepath: c:\Users\user\restaurant-booking-backend\restaurant-booking-frontend\src\services\authService.js
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to log in');
  }

  return response.json();
};

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
const logout = () => {
  removeToken();
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
};

const isAdmin = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    console.error('Error parsing token:', error);
    return false;
  }
};

const debugToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export {
  login,
  logout,
  isAuthenticated,
  isAdmin,
  debugToken,
  setToken,
  getToken,
  removeToken,
  authHeader,
};