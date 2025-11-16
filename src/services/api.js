import axios from 'axios';
import { Platform } from 'react-native';

// API configuration - automatically detects environment
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'web') {
      // Web browser - use localhost
      return 'http://localhost:3000/api';
    } else {
      // Native (iOS/Android) - use your machine's IP address
      // For now, using localhost (works for iOS simulator and Android emulator)
      // For physical devices, replace with your computer's IP: http://192.168.x.x:3000/api
      return 'http://localhost:3000/api';
    }
  } else {
    // Production
    return 'https://your-production-api.com/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: false, // Set to true if using cookies
});

// Request interceptor for logging (only in development)
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    // Silent error handling - don't log to console
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API] Response from ${response.config.url}:`, response.status);
    }
    return response;
  },
  (error) => {
    // Silent error handling - errors will be handled by the calling component
    return Promise.reject(error);
  }
);

// Calculate HVAC strategy
export const calculateHVAC = async (formData, roomData = {}) => {
  try {
    const response = await api.post('/calculate', {
      formData,
      roomData,
    });
    
    return response.data;
  } catch (error) {
    // Re-throw error to be handled by the calling component
    // Don't use mock data - let the error screen handle it
    throw error;
  }
};

// Process room scan data
export const processRoomScan = async (roomData) => {
  try {
    const response = await api.post('/process-room', roomData);
    return response.data;
  } catch (error) {
    // Re-throw error to be handled by the calling component
    throw error;
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    // Use the base URL without /api for health check
    const baseUrl = API_BASE_URL.replace('/api', '');
    const response = await axios.get(`${baseUrl}/health`, {
      timeout: 5000,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// OpenWeather API configuration
const OPENWEATHER_API_KEY = 'fcfb84ca7c78db7620f845bec2a9d053';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Fetch current weather by ZIP code
export const fetchWeatherByZip = async (zipCode) => {
  try {
    if (!zipCode || zipCode.length !== 5) {
      return { success: false, error: 'Invalid ZIP code' };
    }

    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather`,
      {
        params: {
          zip: `${zipCode},us`,
          appid: OPENWEATHER_API_KEY,
          units: 'imperial', // Get temperature in Fahrenheit
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    // Extract temperature from response
    const temperature = Math.round(response.data.main.temp);
    
    return {
      success: true,
      data: {
        temperature,
        description: response.data.weather[0]?.description || '',
        city: response.data.name || '',
        humidity: response.data.main.humidity || null,
      },
    };
  } catch (error) {
    if (error.response) {
      // API returned an error response
      const status = error.response.status;
      if (status === 404) {
        return { success: false, error: 'ZIP code not found' };
      } else if (status === 401) {
        return { success: false, error: 'Invalid API key' };
      }
      return { success: false, error: error.response.data?.message || 'Failed to fetch weather' };
    } else if (error.request) {
      // Request was made but no response received
      return { success: false, error: 'Network error. Please check your connection.' };
    } else {
      // Something else happened
      return { success: false, error: error.message || 'Failed to fetch weather' };
    }
  }
};

export default api;

