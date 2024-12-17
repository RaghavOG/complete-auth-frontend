/* eslint-disable no-unused-vars */
import axios from 'axios';
import store from '@/redux/store';
import { logout } from '@/redux/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7000/api/v1', // Update with your API URL
  withCredentials: true, // Include cookies in all requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Send refresh token request
        const { data } = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
