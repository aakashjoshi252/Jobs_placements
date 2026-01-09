import axios from "axios";

// API Versioning
const API_VERSION = '/api/v1';
const USE_API_VERSIONING = true;

// Dynamic base URL
const getBaseURL = () => {
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_API_PORT || '3000';
  
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:${port}`;
  }
  
  return import.meta.env.VITE_API_URL || `http://localhost:${port}`;
};

const BASE_URL = getBaseURL();
const API_BASE_URL = USE_API_VERSIONING ? `${BASE_URL}${API_VERSION}` : BASE_URL;

// Common config
const axiosConfig = {
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
};

// Create API instance factory
const createApiInstance = (baseURL, apiName) => {
  const instance = axios.create({ baseURL, ...axiosConfig });

  // Minimal interceptors (production-ready)
  instance.interceptors.request.use(
    (config) => {
      if (import.meta.env.DEV) {
        console.log(`📤 [${apiName}] ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (import.meta.env.DEV && error.response) {
        console.error(`❌ [${apiName}] ${error.response.status}: ${error.config?.url}`);
      }
      
      // Auto-logout on 401
      if (error.response?.status === 401) {
        // window.location.href = '/login'; // Uncomment if needed
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// API Instances
export const userApi = createApiInstance(`${API_BASE_URL}/user`, 'User');
export const companyApi = createApiInstance(`${API_BASE_URL}/company`, 'Company');
export const jobsApi = createApiInstance(`${API_BASE_URL}/jobs`, 'Jobs');
export const applicationApi = createApiInstance(`${API_BASE_URL}/application`, 'Application');
export const resumeApi = createApiInstance(`${API_BASE_URL}/resume`, 'Resume');
export const chatApi = createApiInstance(`${API_BASE_URL}/chat`, 'Chat');
export const notificationApi = createApiInstance(`${API_BASE_URL}/notifications`, 'Notification');
export const blogApi = createApiInstance(`${API_BASE_URL}/blog`, 'Blog');
export const dashboardApi = createApiInstance(`${API_BASE_URL}/dashboard`, 'Dashboard');
export const adminApi= createApiInstance(`${API_BASE_URL}/admin`, 'Admin')

// Exports
export { BASE_URL, API_BASE_URL };

// Health check (keep - very useful)
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    if (import.meta.env.DEV) console.log('✅ API Health: OK');
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) console.error('❌ API Health: Server down');
    throw error;
  }
};

// Startup log (minimal)
if (import.meta.env.DEV) {
  console.log(`🚀 API Ready: ${API_BASE_URL}`);
}
