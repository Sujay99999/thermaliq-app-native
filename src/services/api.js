import axios from 'axios';

// API configuration - update with your backend URL when ready
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development - update with your local IP for device testing
  : 'https://your-production-api.com/api';  // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Calculate HVAC strategy
export const calculateHVAC = async (formData, roomData) => {
  try {
    const response = await api.post('/calculate', {
      formData,
      roomData,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    // Return mock data for now if backend is not available
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network')) {
      console.log('Backend not available, using mock data');
      return {
        success: true,
        data: {
          action: 'SETBACK',
          setbackTemp: 78,
          desiredTemp: formData.desiredTemp || 72,
          outdoorTemp: formData.outdoorTemp || 85,
          restartTime: '4:15 PM',
          returnTime: '5:00 PM',
          recoveryTime: 45,
          thermalTimeConstant: 3.5,
          breakEvenTime: 8.8,
          savingsPerDay: 1.80,
          savingsPerMonth: 39.60,
          savingsPerYear: 468,
          energySavedKwh: 1.8,
          percentSaved: 13.3
        }
      };
    }
    throw error;
  }
};

// Process room scan data
export const processRoomScan = async (roomData) => {
  try {
    const response = await api.post('/process-room', roomData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;

