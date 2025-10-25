// src/services/adminApi.js
import axios from 'axios';

const API_BASE_URL = 'https://backend-q0wc.onrender.com'; // Your backend URL

// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - automatically add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if token expired
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

// Admin APIs
export const adminAPI = {
  // Login (already working)
  login: (credentials) => api.post('/api/admin/login', credentials),
  
  // Get All Users (jab ban jayegi)
  getUsers: () => api.get('/api/admin/users'),
  
  // Approve User - POST /api/admin/approvedUser
  approveUser: (userId, adminId) => 
    api.post('/api/admin/approvedUser', { 
      id: userId, 
      approved_by: adminId 
    }),
  
  // On-Hold User - POST /api/admin/on-hold
  onHoldUser: (userId, reason) => 
    api.post('/api/admin/on-hold', { 
      user_id: userId, 
      reason: reason 
    }),
  
  // Deactivate User - POST /api/admin/deactivate
  deactivateUser: (userId, reason) => 
    api.post('/api/admin/deactivate', { 
      user_id: userId, 
      reason: reason 
    }),
};

export default api;