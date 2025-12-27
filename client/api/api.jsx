import axios from "axios";

// Dynamic base URL - works with localhost and network IP
const getBaseURL = () => {
  // Check if running on network IP
  const hostname = window.location.hostname;
  
  // If accessing via network IP, use that IP for backend
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3000`;
  }
  
  // Default to localhost
  return "http://localhost:3000";
};

const BASE_URL = getBaseURL();

console.log(`🌐 API Base URL: ${BASE_URL}`);

//  COMMON CONFIG (VERY IMPORTANT)
const axiosConfig = {
  withCredentials: true, //  SEND COOKIES
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
      return response;
    },
    (error) => {
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        console.warn('⚠️  Unauthorized access - redirecting to login');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// ================= DASHBOARD =================
export const dashboardApi = createApiInstance(`${BASE_URL}/dashboard`);

// ================= Chat-Box ===================
export const chatApi = createApiInstance(`${BASE_URL}/chat`);

// ================= USER =================
export const userApi = createApiInstance(`${BASE_URL}/user`);

// ================= COMPANY =================
export const companyApi = createApiInstance(`${BASE_URL}/company`);

// ================= JOBS =================
export const jobsApi = createApiInstance(`${BASE_URL}/jobs`);

// ================= RESUME =================
export const resumeApi = createApiInstance(`${BASE_URL}/resume`);

// ================= APPLICATION =================
export const applicationApi = createApiInstance(`${BASE_URL}/application`);

// ================= Notification =================
export const notificationApi = createApiInstance(`${BASE_URL}/notifications`);

// Export BASE_URL for Socket.IO
export { BASE_URL };
