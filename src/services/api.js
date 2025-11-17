import axios from 'axios';
import { Platform } from 'react-native';

// API configuration - automatically detects environment
// For physical devices with Expo Go, you need to use your computer's local IP address
// To find your IP: 
//   macOS/Linux: ifconfig | grep "inet " or ipconfig getifaddr en0
//   Windows: ipconfig (look for IPv4 Address)
// Then update LOCAL_IP below or set it via environment variable

// Set this to your computer's local IP address when testing on physical devices
// Example: '192.168.1.100' (without http://, port, or path)
// Leave as null to use localhost (works for simulators/emulators)
const LOCAL_IP = "172.20.10.4"; // Change this to your local IP for physical device testing

const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'web') {
      // Web browser - use localhost
      return 'http://localhost:3000/api';
    } else {
      // Native (iOS/Android)
      // For simulators/emulators: use localhost
      // For physical devices: use your computer's local IP
      if (LOCAL_IP) {
        return `http://${LOCAL_IP}:3000/api`;
      }
      // Default to localhost (works for iOS simulator and Android emulator)
      return 'http://localhost:3000/api';
    }
  } else {
    // Production
    return 'https://your-production-api.com/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL in development for debugging
if (__DEV__) {
  console.log(`[API] Base URL configured: ${API_BASE_URL}`);
  if (LOCAL_IP) {
    console.log(`[API] Using local IP: ${LOCAL_IP}`);
  } else {
    console.log(`[API] Using localhost (simulator/emulator mode)`);
  }
}

// Create axios instance with React Native compatible configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 60000, // 60 seconds - increased for slower networks
  withCredentials: false, // Set to true if using cookies
  // React Native specific: ensure proper adapter for mobile platforms
  adapter: Platform.OS !== 'web' ? undefined : undefined, // Use default adapter
});

// Add request interceptor to log full URL for debugging
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      const fullUrl = config.baseURL + config.url;
      console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`);
      if (Platform.OS !== 'web') {
        console.log(`[API] Platform: ${Platform.OS}, IP: ${LOCAL_IP || 'localhost'}`);
      }
    }
    return config;
  },
  (error) => {
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
    // Enhanced error handling with better timeout messages
    if (__DEV__) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error(`[API] Request timeout: ${error.config?.url}`);
        console.error(`[API] Timeout after ${error.config?.timeout}ms`);
      } else if (error.code === 'ECONNREFUSED') {
        console.error(`[API] Connection refused: ${error.config?.url}`);
        console.error(`[API] Make sure backend is running on ${API_BASE_URL.replace('/api', '')}`);
      } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        console.error(`[API] DNS/Network error: ${error.config?.url}`);
        console.error(`[API] Check your network connection and IP address`);
      } else {
        console.error(`[API] Error:`, error.message);
      }
    }
    
    // Enhance error object with user-friendly messages
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      error.userMessage = `Request timed out. The server is taking too long to respond. Please check your connection and try again.`;
    } else if (error.code === 'ECONNREFUSED') {
      error.userMessage = `Cannot connect to backend server. Make sure the backend is running on ${API_BASE_URL.replace('/api', '')}`;
    } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      error.userMessage = `Network error. Please check your internet connection and verify the server IP address is correct.`;
    } else if (error.request && !error.response) {
      error.userMessage = `Network error. Unable to reach the server. Please check your connection.`;
    }
    
    return Promise.reject(error);
  }
);

// Calculate HVAC strategy
export const calculateHVAC = async (formData, roomData = {}) => {
  try {
    if (__DEV__) {
      console.log(`[API] Calculating HVAC strategy...`);
      console.log(`[API] Base URL: ${API_BASE_URL}`);
    }
    
    const response = await api.post('/calculate', {
      formData,
      roomData,
    });
    
    if (__DEV__) {
      console.log(`[API] Calculation successful`);
    }
    
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.error(`[API] Calculation failed:`, error.message);
      if (error.userMessage) {
        console.error(`[API] User message:`, error.userMessage);
      }
    }
    // Re-throw error to be handled by the calling component
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

// Extract measurements from Matterport scan
export const extractMatterportMeasurements = async (modelSid) => {
  try {
    if (__DEV__) {
      console.log(`[API] Extracting Matterport measurements for Model SID: ${modelSid}`);
      console.log(`[API] Platform: ${Platform.OS}`);
      console.log(`[API] Base URL: ${API_BASE_URL}`);
      console.log(`[API] Full URL: ${API_BASE_URL}/matterport/extract-measurements`);
    }
    
    const startTime = Date.now();
    const response = await api.post('/matterport/extract-measurements', {
      modelSid,
    });
    const duration = Date.now() - startTime;
    
    if (__DEV__) {
      console.log(`[API] Matterport measurements extracted successfully in ${duration}ms`);
      console.log(`[API] Response data:`, JSON.stringify(response.data, null, 2));
    }
    
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.error(`[API] ❌ Failed to extract Matterport measurements`);
      console.error(`[API] Error type: ${error.constructor.name}`);
      console.error(`[API] Error message: ${error.message}`);
      console.error(`[API] Error code: ${error.code || 'N/A'}`);
      console.error(`[API] Error response status: ${error.response?.status || 'N/A'}`);
      console.error(`[API] Error response data:`, error.response?.data || 'N/A');
      console.error(`[API] Request config:`, {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout,
      });
      
      if (error.userMessage) {
        console.error(`[API] User message:`, error.userMessage);
      }
      
      // Platform-specific diagnostics
      if (Platform.OS !== 'web') {
        console.error(`[API] Mobile diagnostics:`);
        console.error(`[API]   - Platform: ${Platform.OS}`);
        console.error(`[API]   - API Base URL: ${API_BASE_URL}`);
        console.error(`[API]   - Local IP: ${LOCAL_IP || 'Not set'}`);
        
        if (error.code === 'ECONNREFUSED') {
          console.error(`[API]   - Issue: Cannot connect to backend`);
          console.error(`[API]   - Solution: Check if backend is running on ${API_BASE_URL.replace('/api', '')}`);
        } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
          console.error(`[API]   - Issue: DNS/Network error`);
          console.error(`[API]   - Solution: Verify phone and computer are on same network`);
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          console.error(`[API]   - Issue: Request timed out`);
          console.error(`[API]   - Solution: Backend may be slow or Matterport API is taking too long`);
        }
      }
    }
    
    // Enhance error with better user message
    if (!error.userMessage) {
      if (error.response) {
        // Server responded with error
        error.userMessage = error.response.data?.error?.message || 
          `Server error: ${error.response.status} - ${error.response.statusText}`;
      } else if (error.request) {
        // Request made but no response
        if (error.code === 'ECONNREFUSED') {
          error.userMessage = 'Cannot connect to backend server. Please check your connection.';
        } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
          error.userMessage = 'Network error. Please check your internet connection.';
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          error.userMessage = 'Request timed out. The server may be taking too long to respond.';
        } else {
          error.userMessage = 'Network error. Unable to reach the server.';
        }
      } else {
        error.userMessage = error.message || 'An unexpected error occurred.';
      }
    }
    
    // Re-throw error to be handled by the calling component
    throw error;
  }
};

// Test API connection with detailed diagnostics
export const testApiConnection = async () => {
  const baseUrl = API_BASE_URL.replace('/api', '');
  const diagnostics = {
    platform: Platform.OS,
    baseUrl,
    localIp: LOCAL_IP,
    timestamp: new Date().toISOString(),
  };

  try {
    if (__DEV__) {
      console.log(`[API] Testing connection to: ${baseUrl}/health`);
      console.log(`[API] Platform: ${Platform.OS}`);
      console.log(`[API] Using IP: ${LOCAL_IP || 'localhost'}`);
    }

    const response = await axios.get(`${baseUrl}/health`, {
      timeout: 5000,
    });
    
    if (__DEV__) {
      console.log(`[API] ✅ Connection successful! Status: ${response.status}`);
    }

    return { 
      success: true, 
      data: response.data,
      diagnostics: {
        ...diagnostics,
        status: response.status,
        responseTime: Date.now(),
      }
    };
  } catch (error) {
    const errorDetails = {
      ...diagnostics,
      errorCode: error.code,
      errorMessage: error.message,
      errorType: error.response ? 'HTTP_ERROR' : error.request ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
    };

    if (__DEV__) {
      console.error(`[API] ❌ Connection failed:`);
      console.error(`[API] Error code: ${error.code}`);
      console.error(`[API] Error message: ${error.message}`);
      
      if (Platform.OS !== 'web') {
        if (error.code === 'ECONNREFUSED') {
          console.error(`[API] 🔴 Connection Refused - Possible causes:`);
          console.error(`[API]    1. Backend server is not running`);
          console.error(`[API]    2. Backend is not listening on ${LOCAL_IP || 'localhost'}`);
          console.error(`[API]    3. Firewall is blocking port 3000`);
          console.error(`[API]    4. IP address ${LOCAL_IP} is incorrect`);
        } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
          console.error(`[API] 🔴 DNS/Network Error - Possible causes:`);
          console.error(`[API]    1. Phone and computer are not on the same network`);
          console.error(`[API]    2. IP address ${LOCAL_IP} is incorrect`);
          console.error(`[API]    3. Network connectivity issues`);
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          console.error(`[API] 🔴 Timeout - Possible causes:`);
          console.error(`[API]    1. Backend server is slow or unresponsive`);
          console.error(`[API]    2. Network latency is too high`);
          console.error(`[API]    3. Firewall is blocking the connection`);
        }
      }
    }

    return { 
      success: false, 
      error: error.message,
      diagnostics: errorDetails,
    };
  }
};

// Network diagnostic utility
export const diagnoseNetwork = async () => {
  const diagnostics = {
    platform: Platform.OS,
    apiBaseUrl: API_BASE_URL,
    localIp: LOCAL_IP,
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Test 1: Health check
  const healthTest = await testApiConnection();
  diagnostics.tests.healthCheck = healthTest;

  // Test 2: Try different IPs if health check fails
  if (!healthTest.success && Platform.OS !== 'web') {
    if (__DEV__) {
      console.log(`[API] Health check failed, attempting diagnostics...`);
    }
    
    // Try localhost as fallback
    try {
      const localhostUrl = 'http://localhost:3000/health';
      const response = await axios.get(localhostUrl, { timeout: 3000 });
      diagnostics.tests.localhostFallback = { success: true, message: 'localhost works (simulator/emulator mode)' };
    } catch (e) {
      diagnostics.tests.localhostFallback = { success: false, error: e.message };
    }
  }

  return diagnostics;
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

