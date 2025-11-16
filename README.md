# THERMSOL.ai - React Native App

This is the React Native version of the THERMSOL.ai HVAC optimization app, migrated from the React web application.

## Features

- ✅ Multi-step form for collecting building and HVAC data
- ✅ AR room scanning with expo-roomplan (iOS 16+)
- ✅ Physics-based HVAC strategy recommendations
- ✅ Results visualization with charts and comparisons
- ✅ Scenario simulator for testing different parameters
- ✅ Backend API integration ready (mock data fallback)

## Project Structure

```
thermaliq-app-native/
├── src/
│   ├── screens/          # Main screens
│   │   ├── Home.jsx
│   │   ├── InputForm.jsx
│   │   ├── Loading.jsx
│   │   ├── Results.jsx
│   │   └── RoomScan.jsx  # AR room scanning
│   ├── components/
│   │   ├── forms/        # Form step components
│   │   ├── ComparisonTable.jsx
│   │   └── ScenarioSimulator.jsx
│   ├── navigation/
│   │   └── AppNavigator.jsx
│   ├── services/
│   │   └── api.js       # API service (ready for backend)
│   └── index.css        # NativeWind styles
├── App.js
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS device with iOS 16+ (for RoomPlan AR scanning)
- Xcode (for iOS development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start --dev-client
```

### Running on Device

**Important**: `expo-roomplan` requires a development build (not Expo Go) and only works on physical iOS devices.

1. Build development build:
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for iOS (local)
eas build --profile development --platform ios --local

# OR use prebuild
npx expo prebuild
```

2. Install on device and run:
```bash
npx expo start --dev-client
```

## Backend Integration

The app is ready for backend integration. Update the API URL in `src/services/api.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_LOCAL_IP:3000/api'  // Use your computer's local IP for device testing
  : 'https://your-production-api.com/api';
```

The API service includes:
- `calculateHVAC(formData, roomData)` - Calculate HVAC strategy
- `processRoomScan(roomData)` - Process room scan data
- Automatic fallback to mock data if backend is unavailable

## Key Dependencies

- `expo` - Expo framework
- `expo-roomplan` - Apple RoomPlan SDK integration
- `@react-navigation/native` - Navigation
- `nativewind` - Tailwind CSS for React Native
- `react-native-chart-kit` - Charts (can be replaced with victory-native)
- `@react-native-community/slider` - Slider component
- `axios` - HTTP client

## Notes

1. **RoomPlan AR Scanning**: 
   - Only works on physical iOS 16+ devices
   - Requires development build (not Expo Go)
   - Check expo-roomplan documentation for exact API usage

2. **Charts**: 
   - Currently using simplified components
   - Can be enhanced with victory-native or react-native-chart-kit

3. **Styling**: 
   - Using NativeWind (Tailwind for React Native)
   - Some web-specific classes may need adjustment

4. **Testing**:
   - Update API URL to your local IP for device testing
   - Backend should allow CORS from your app

## Next Steps

1. Set up Node.js/Express backend (see backend setup guide)
2. Implement physics calculations in backend
3. Test RoomPlan integration on physical device
4. Enhance charts and visualizations
5. Add error handling and validation
6. Test on multiple devices

## Development Commands

```bash
# Start development server
npx expo start --dev-client

# iOS simulator
npx expo start --ios

# Android (if needed)
npx expo start --android

# Build for production
eas build --platform ios
```

## Troubleshooting

- **RoomPlan not working**: Ensure you're using a development build on a physical iOS 16+ device
- **API connection issues**: Update API_BASE_URL with your computer's local IP address
- **Navigation errors**: Ensure all screen components are properly exported
- **Styling issues**: Check NativeWind configuration in babel.config.js

