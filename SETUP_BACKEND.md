# Backend Setup & Running Guide

This guide explains how to set up and run the backend server alongside the React Native app.

## 📁 Project Structure

```
Desktop/
├── thermaliq-backend/          # Node.js/Express backend
│   ├── server.js               # Main server (port 3000)
│   ├── routes/                 # API routes
│   ├── controllers/            # Request handlers
│   └── services/               # Business logic
│
└── thermaliq-app-native/        # React Native/Expo app
    ├── src/
    │   └── services/
    │       └── api.js          # API client (connects to backend)
    └── package.json
```

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd ~/Desktop/thermaliq-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - CORS middleware
- `body-parser` - Request body parsing
- `dotenv` - Environment variables
- `axios` - HTTP client
- `nodemon` - Auto-reload (dev dependency)

### Step 3: Create Environment File (Optional)

The backend works without a `.env` file (uses defaults), but you can create one for customization:

```bash
# Create .env file
cat > .env << EOF
PORT=3000
NODE_ENV=development
EOF
```

### Step 4: Verify Backend Structure

The backend should have these endpoints:
- `GET /health` - Health check
- `POST /api/calculate` - HVAC calculation
- `POST /api/process-room` - Room scan processing

## 🚀 Running the Backend

### Development Mode (with auto-reload)

```bash
cd ~/Desktop/thermaliq-backend
npm run dev
```

The server will start on `http://localhost:3000` and automatically reload on file changes.

### Production Mode

```bash
cd ~/Desktop/thermaliq-backend
npm start
```

### Verify Backend is Running

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"ok","message":"THERMSOL.ai Backend API is running",...}
```

## 📱 Running the Native App

### Step 1: Navigate to App Directory

```bash
cd ~/Desktop/thermaliq-app-native
```

### Step 2: Install Dependencies (if not done)

```bash
npm install
```

### Step 3: Start Expo Development Server

```bash
npm start
# or
npx expo start
```

### Step 4: Choose Your Platform

- **iOS Simulator**: Press `i` in the terminal or scan QR code
- **Android Emulator**: Press `a` in the terminal or scan QR code
- **Physical Device**: Scan QR code with Expo Go app (or development build)

## 🔗 Connecting App to Backend

### For Simulator/Emulator (localhost works)

The app is already configured to use `http://localhost:3000/api` for simulators/emulators. No changes needed!

### For Physical Device (requires local IP)

If testing on a physical device, you need to update the API URL to use your computer's local IP address.

#### Step 1: Find Your Local IP Address

**macOS:**
```bash
ipconfig getifaddr en0
# or
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Linux:**
```bash
hostname -I
# or
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

Example output: `192.168.1.100`

#### Step 2: Update API Configuration

Edit `src/services/api.js` and update the API URL:

```javascript
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:3000/api';
    } else {
      // Replace with your local IP address
      return 'http://192.168.1.100:3000/api';  // ← Update this
    }
  } else {
    return 'https://your-production-api.com/api';
  }
};
```

#### Step 3: Ensure Same Network

Make sure your computer and phone are on the **same Wi-Fi network**.

## 🎯 Running Both Services Together

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd ~/Desktop/thermaliq-backend
npm run dev
```

**Terminal 2 - Native App:**
```bash
cd ~/Desktop/thermaliq-app-native
npm start
```

### Option 2: Using the Helper Script

See `run-both.sh` script in the app directory (if created).

## ✅ Verification Checklist

- [ ] Backend server running on port 3000
- [ ] Health check endpoint responds: `curl http://localhost:3000/health`
- [ ] Native app dependencies installed
- [ ] Expo dev server running
- [ ] API URL configured correctly (localhost for simulator, local IP for device)
- [ ] Both services running simultaneously

## 🧪 Testing the Connection

### Test 1: Health Check from App

The app has a `testApiConnection()` function. You can test it in the app or via the API service.

### Test 2: Manual API Test

```bash
# Test calculate endpoint
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "outdoorTemp": 85,
      "desiredTemp": 72,
      "absenceDuration": 8,
      "floorArea": 2000
    }
  }'
```

### Test 3: From the App

1. Open the app
2. Navigate to the Input Form
3. Fill out the form
4. Submit - it should connect to the backend

## 🐛 Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Or change PORT in .env file
```

**CORS errors:**
- Backend CORS is configured to allow all origins in development
- Check `server.js` CORS configuration if issues persist

**Dependencies not installed:**
```bash
cd ~/Desktop/thermaliq-backend
rm -rf node_modules package-lock.json
npm install
```

### App Connection Issues

**"Network Error" or "Connection refused":**
- Verify backend is running: `curl http://localhost:3000/health`
- Check API URL in `src/services/api.js`
- For physical device: ensure using local IP, not localhost
- Ensure both devices on same network

**"CORS error":**
- Backend should allow all origins in development
- Check backend CORS configuration in `server.js`

**Timeout errors:**
- Increase timeout in `src/services/api.js` (currently 30 seconds)
- Check network connection

### General Issues

**Both services won't start:**
- Check Node.js version: `node --version` (should be v16+)
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies in both projects

**Changes not reflecting:**
- Backend: Restart server (or use `npm run dev` for auto-reload)
- App: Reload in Expo (press `r` in terminal or shake device)

## 📊 API Endpoints Reference

### Health Check
```
GET /health
Response: { status: "ok", message: "...", timestamp: "..." }
```

### Calculate HVAC Strategy
```
POST /api/calculate
Body: {
  formData: { outdoorTemp, desiredTemp, absenceDuration, floorArea, ... },
  roomData: { dimensions, surfaces, openings, ... }
}
Response: {
  success: true,
  data: { action, setbackTemp, savingsPerYear, ... }
}
```

### Process Room Scan
```
POST /api/process-room
Body: {
  dimensions: { width, height, depth },
  surfaces: [],
  openings: [],
  rawData: {}
}
Response: {
  success: true,
  data: { processedDimensions, volume, surfaceArea, ... }
}
```

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd ~/Desktop/thermaliq-backend && npm run dev

# Terminal 2: Start App
cd ~/Desktop/thermaliq-app-native && npm start
```

## 📝 Next Steps

1. ✅ Backend running on port 3000
2. ✅ App connecting to backend
3. ✅ Test form submission
4. ✅ Test room scan processing
5. ✅ Verify calculations are working
6. ✅ Test on physical device (if needed)

---

**Need Help?** Check the backend `README.md` or app `README.md` for more details.

