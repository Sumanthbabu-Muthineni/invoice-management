// src/services/Api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth state and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle forbidden errors (403)
    if (error.response?.status === 403) {
      window.location.href = '/unauthorized';
      return Promise.reject(error);
    }

    // Handle not found errors (404)
    if (error.response?.status === 404) {
      return Promise.reject({
        ...error,
        message: 'The requested resource was not found'
      });
    }

    // Handle server errors (500)
    if (error.response?.status >= 500) {
      return Promise.reject({
        ...error,
        message: 'An unexpected error occurred. Please try again later.'
      });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Unable to connect to the server. Please check your internet connection.'
      });
    }

    return Promise.reject(error);
  }
);

// Add response data wrapper
api.getData = async function(endpoint, config = {}) {
  try {
    const response = await this.get(endpoint, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add helper method for form data
api.postForm = async function(endpoint, formData, config = {}) {
  try {
    const response = await this.post(endpoint, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add helper for downloading files
api.downloadFile = async function(endpoint, config = {}) {
  try {
    const response = await this.get(endpoint, {
      ...config,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;