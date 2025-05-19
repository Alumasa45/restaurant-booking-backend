// src/services/adminService.js
import axios from 'axios';
import {authHeader, debugToken, getToken, isAdmin, isAuthenticated, login, logout, removeToken, setToken} from './authService';
import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get admin dashboard statistics
const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

// Get all reservations
const getAllReservations = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/reservations`, {
      headers: authHeader(),
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

// Update reservation status
const updateReservationStatus = async (reservationId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/reservations/${reservationId}`,
      { status },
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Update user role
const updateUserRole = async (userId, role) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/users/${userId}`,
      { role },
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

const fetchAdminDashboardData = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};

const adminService = {
  getDashboardStats,
  getAllReservations,
  updateReservationStatus,
  getAllUsers,
  updateUserRole
};

export { fetchAdminDashboardData };
export default adminService;