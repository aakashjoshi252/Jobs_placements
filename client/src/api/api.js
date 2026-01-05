import axios from "axios";

// API Version Configuration
const API_VERSION = '/api/v1';
const USE_API_VERSIONING = true; // Set to false to use legacy routes

// Dynamic base URL - works with localhost and network IP
const getBaseURL = () => {
  // Check if running on network IP
  const hostname = window.location.hostname;
  
  // Default port for backend
  const port = import.meta.env.VITE_API_PORT || '3000';
  
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
const API_BASE_URL = USE_API_VERSIONING ? `${BASE_URL}${API_VERSION}` : BASE_URL;

console.log(`🌐 API Base URL: ${BASE_URL}`);
console.log(`🔧 API Version: ${USE_API_VERSIONING ? API_VERSION : 'Legacy (no version)'}`);
console.log(`✅ Full API URL: ${API_BASE_URL}`);

// COMMON CONFIG (VERY IMPORTANT)
const axiosConfig = {
  withCredentials: true, // SEND COOKIES
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add request interceptor for debugging
const createApiInstance = (baseURL, apiName) => {
  const instance = axios.create({
    baseURL,
    ...axiosConfig,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Log API calls in development
      if (import.meta.env.DEV) {
        console.log(`📤 [${apiName}] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
      }
      return config;
    },
    (error) => {
      console.error(`❌ [${apiName}] Request error:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      if (import.meta.env.DEV) {
        console.log(`✅ [${apiName}] ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
      }
      return response;
    },
    (error) => {
      // Enhanced error logging
      if (error.response) {
        console.error(
          `❌ [${apiName}] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status}`
        );
        console.error('Error data:', error.response.data);
        
        // Show user-friendly error message
        const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
        console.error(`💬 Error message: ${errorMessage}`);
      } else if (error.request) {
        console.error(`🔌 [${apiName}] No response received:`, error.request);
        console.error('💡 Tip: Check if the backend server is running');
      } else {
        console.error(`⚠️ [${apiName}] Error:`, error.message);
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        console.warn(`🔒 [${apiName}] Unauthorized access - Please login again`);
        // Optionally dispatch logout action or redirect
        // window.location.href = '/login';
      }
      
      // Handle 404 Not Found
      if (error.response?.status === 404) {
        console.warn(`🔍 [${apiName}] Resource not found - Check API endpoint`);
      }
      
      // Handle 500 Server Error
      if (error.response?.status === 500) {
        console.error(`🔥 [${apiName}] Server error - Contact support if this persists`);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// ================= USER API =================
export const userApi = createApiInstance(`${API_BASE_URL}/user`, 'UserAPI');

// ================= COMPANY API =================
export const companyApi = createApiInstance(`${API_BASE_URL}/company`, 'CompanyAPI');

// ================= JOBS API =================
export const jobsApi = createApiInstance(`${API_BASE_URL}/jobs`, 'JobsAPI');

// ================= APPLICATION API =================
export const applicationApi = createApiInstance(`${API_BASE_URL}/application`, 'ApplicationAPI');

// ================= RESUME API =================
export const resumeApi = createApiInstance(`${API_BASE_URL}/resume`, 'ResumeAPI');

// ================= CHAT API =================
export const chatApi = createApiInstance(`${API_BASE_URL}/chat`, 'ChatAPI');

// ================= NOTIFICATION API =================
export const notificationApi = createApiInstance(`${API_BASE_URL}/notifications`, 'NotificationAPI');

// ================= BLOG API (FIXED: /blogs -> /blog) =================
export const blogApi = createApiInstance(`${API_BASE_URL}/blog`, 'BlogAPI');

// ================= DASHBOARD API =================
export const dashboardApi = createApiInstance(`${API_BASE_URL}/dashboard`, 'DashboardAPI');

// Export BASE_URL for Socket.IO and other uses
export { BASE_URL, API_BASE_URL, API_VERSION };

// Health check utility
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`, {
      timeout: 5000,
    });
    console.log('💚 API Health Check: Server is running', response.data);
    return response.data;
  } catch (error) {
    console.error('💔 API Health Check: Server is not responding', error.message);
    throw error;
  }
};

// Log API configuration on startup
if (import.meta.env.DEV) {
  console.log('\n📋 API Configuration:');
  console.log('├─ Base URL:', BASE_URL);
  console.log('├─ API Version:', USE_API_VERSIONING ? API_VERSION : 'None (Legacy)');
  console.log('├─ Full API URL:', API_BASE_URL);
  console.log('├─ With Credentials:', axiosConfig.withCredentials);
  console.log('└─ Environment:', import.meta.env.MODE);
  console.log('\n🔗 Available APIs:');
  console.log('├─ User:', `${API_BASE_URL}/user`);
  console.log('├─ Company:', `${API_BASE_URL}/company`);
  console.log('├─ Jobs:', `${API_BASE_URL}/jobs`);
  console.log('├─ Application:', `${API_BASE_URL}/application`);
  console.log('├─ Resume:', `${API_BASE_URL}/resume`);
  console.log('├─ Chat:', `${API_BASE_URL}/chat`);
  console.log('├─ Notification:', `${API_BASE_URL}/notifications`);
  console.log('├─ Blog:', `${API_BASE_URL}/blog`, '(Fixed from /blogs)');
  console.log('└─ Dashboard:', `${API_BASE_URL}/dashboard`);
  console.log('\n✨ Frontend API configuration updated successfully!\n');
}