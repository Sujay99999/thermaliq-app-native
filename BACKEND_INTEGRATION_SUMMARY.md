# Backend Integration Summary

## 📋 Overview

Your project consists of two parts:
1. **Backend** (`Desktop/thermaliq-backend`) - Node.js/Express API server
2. **Native App** (`Desktop/thermaliq-app-native`) - React Native/Expo app

Both are already configured to work together!

## 🔌 Current Configuration

### Backend
- **Port**: 3000 (default)
- **Base URL**: `http://localhost:3000`
- **API Endpoints**:
  - `GET /health` - Health check
  - `POST /api/calculate` - HVAC calculations
  - `POST /api/process-room` - Room scan processing
- **CORS**: Enabled for all origins in development

### Native App
- **API Client**: `src/services/api.js`
- **Development URL**: `http://localhost:3000/api` (for simulators)
- **Production URL**: `https://your-production-api.com/api` (to be configured)

## ✅ What's Already Set Up

1. ✅ Backend server with Express.js
2. ✅ CORS configuration for React Native
3. ✅ API routes (`/api/calculate`, `/api/process-room`)
4. ✅ Health check endpoint
5. ✅ Native app API service configured
6. ✅ Error handling in both frontend and backend
7. ✅ Request/response interceptors

## 🚀 How to Run

### Quick Start (Recommended)

```bash
# Terminal 1: Backend
cd ~/Desktop/thermaliq-backend
npm install  # First time only
npm run dev

# Terminal 2: App
cd ~/Desktop/thermaliq-app-native
npm install  # First time only
npm start
```

### Or Use the Helper Script

```bash
cd ~/Desktop/thermaliq-app-native
./run-both.sh
```

## 📱 Platform-Specific Notes

### iOS Simulator / Android Emulator
- ✅ Works with `localhost:3000` (current configuration)
- ✅ No changes needed

### Physical Device (iPhone/Android)
- ⚠️ Requires local IP address instead of localhost
- Update `src/services/api.js` line 15:
  ```javascript
  return 'http://YOUR_LOCAL_IP:3000/api';
  ```
- Find your IP:
  - macOS: `ipconfig getifaddr en0`
  - Linux: `hostname -I`
  - Windows: `ipconfig`

## 🔍 API Endpoints Mapping

| App Function | API Endpoint | Method | Status |
|-------------|--------------|--------|--------|
| Health Check | `/health` | GET | ✅ Ready |
| Calculate HVAC | `/api/calculate` | POST | ✅ Ready |
| Process Room | `/api/process-room` | POST | ✅ Ready |

## 📝 API Request/Response Examples

### Calculate HVAC Strategy

**Request** (from app):
```javascript
calculateHVAC(formData, roomData)
```

**Backend receives**:
```json
POST /api/calculate
{
  "formData": {
    "outdoorTemp": 85,
    "desiredTemp": 72,
    "absenceDuration": 8,
    "floorArea": 2000,
    ...
  },
  "roomData": {
    "dimensions": {...},
    "surfaces": [],
    "openings": []
  }
}
```

**Backend responds**:
```json
{
  "success": true,
  "data": {
    "action": "SETBACK",
    "setbackTemp": 78,
    "savingsPerYear": 468,
    ...
  }
}
```

### Process Room Scan

**Request** (from app):
```javascript
processRoomScan(roomData)
```

**Backend receives**:
```json
POST /api/process-room
{
  "dimensions": { "width": 20, "height": 10, "depth": 15 },
  "surfaces": [],
  "openings": [],
  "rawData": {}
}
```

## 🧪 Testing

### 1. Test Backend Directly

```bash
# Health check
curl http://localhost:3000/health

# Calculate endpoint
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"formData":{"outdoorTemp":85,"desiredTemp":72,"absenceDuration":8,"floorArea":2000}}'
```

### 2. Test from App

1. Start both services
2. Open app in simulator/device
3. Navigate to Input Form
4. Fill out form and submit
5. Should see results from backend

### 3. Check Logs

- **Backend logs**: Terminal running `npm run dev`
- **App logs**: Expo dev server terminal
- **Network requests**: Check Expo dev tools or React Native debugger

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is in use: `lsof -ti:3000`
- Kill process: `kill -9 $(lsof -ti:3000)`
- Or change PORT in `.env` file

### App can't connect
- Verify backend is running: `curl http://localhost:3000/health`
- Check API URL in `src/services/api.js`
- For device: use local IP, not localhost
- Ensure same Wi-Fi network

### CORS errors
- Backend CORS allows all origins in development
- Check `server.js` CORS configuration

### Timeout errors
- Increase timeout in `api.js` (currently 30 seconds)
- Check network connection

## 📚 Documentation Files

- **`SETUP_BACKEND.md`** - Detailed setup instructions
- **`QUICK_START.md`** - Quick reference guide
- **`run-both.sh`** - Helper script to run both services
- **Backend `README.md`** - Backend-specific documentation

## 🎯 Next Steps

1. ✅ Both services running
2. ✅ Test form submission
3. ✅ Test room scan processing
4. ✅ Verify calculations
5. ⏭️ Test on physical device (if needed)
6. ⏭️ Configure production API URL
7. ⏭️ Deploy backend to production

## 💡 Tips

- Use `npm run dev` for backend (auto-reload on changes)
- Use Expo's hot reload for app changes
- Check backend logs for API request details
- Use React Native debugger for network inspection
- Test health endpoint first before trying other endpoints

---

**Ready to go!** Start both services and test the integration. 🚀

