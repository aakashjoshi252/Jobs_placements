import axios from "axios";

// Dynamic base URL - works with localhost and network IP
const getBaseURL = () => {
  // Check if running on network IP
  const hostname = window.location.hostname;
  
  // Default port for backend
  const port = import.meta.env.VITE_API_PORT || '5000';
  
  // If accessing via network IP, use that IP for backend
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:${port}`;
  }
  
  // Check for environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to localhost with port 5000
  return `http://localhost:${port}`;
};

const BASE_URL = getBaseURL();

console.log(`🚀 API Base URL: ${BASE_URL}`);

// COMMON CONFIG (VERY IMPORTANT)
const axiosConfig = {
  withCredentials: true, // SEND COOKIES
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add request interceptor for debugging
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    ...axiosConfig,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Log API calls in development
      if (import.meta.env.DEV) {
        console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
      }
      return config;
    },
    (error) => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      if (import.meta.env.DEV) {
        console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
      }
      return response;
    },
    (error) => {
      // Enhanced error logging
      if (error.response) {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status}`);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
      } else {
        console.error('❌ Error:', error.message);
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        console.warn('⚠️ Unauthorized access - redirecting to login');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// ================= DASHBOARD =================
export const dashboardApi = createApiInstance(`${BASE_URL}/api/dashboard`);

// ================= Chat-Box ===================
export const chatApi = createApiInstance(`${BASE_URL}/api/chat`);

// ================= USER =================
export const userApi = createApiInstance(`${BASE_URL}/api/user`);

// ================= COMPANY =================
export const companyApi = createApiInstance(`${BASE_URL}/api/company`);

// ================= JOBS =================
export const jobsApi = createApiInstance(`${BASE_URL}/api/jobs`);

// ================= RESUME =================
export const resumeApi = createApiInstance(`${BASE_URL}/api/resume`);

// ================= APPLICATION =================
export const applicationApi = createApiInstance(`${BASE_URL}/api/application`);

// ================= Notification =================
export const notificationApi = createApiInstance(`${BASE_URL}/api/notifications`);

// ================= BLOGS =================
export const blogApi = createApiInstance(`${BASE_URL}/api/blogs`);

// Export BASE_URL for Socket.IO
export { BASE_URL };