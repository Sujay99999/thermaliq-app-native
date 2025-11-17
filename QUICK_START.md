# 🚀 Quick Start Guide

## Running Backend + Native App Together

### Method 1: Automated Script (Easiest)

```bash
cd ~/Desktop/thermaliq-app-native
./run-both.sh
```

This will:
- ✅ Start backend on port 3000
- ✅ Start Expo dev server
- ✅ Show logs from both services
- ✅ Stop both with Ctrl+C

### Method 2: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd ~/Desktop/thermaliq-backend
npm install  # First time only
npm run dev
```

**Terminal 2 - App:**
```bash
cd ~/Desktop/thermaliq-app-native
npm install  # First time only
npm start
```

## 📍 URLs

- **Backend API**: http://localhost:3000
- **Backend Health**: http://localhost:3000/health
- **Expo Dev Server**: http://localhost:8081 (or shown in terminal)

## 🔧 First Time Setup

1. **Backend:**
   ```bash
   cd ~/Desktop/thermaliq-backend
   npm install
   ```

2. **App:**
   ```bash
   cd ~/Desktop/thermaliq-app-native
   npm install
   ```

## 📱 Testing on Device

For **physical devices**, update `src/services/api.js`:

```javascript
// Replace localhost with your computer's IP
return 'http://192.168.1.100:3000/api';  // Your IP here
```

Find your IP:
- **macOS**: `ipconfig getifaddr en0`
- **Linux**: `hostname -I`
- **Windows**: `ipconfig` (look for IPv4 Address)

## ✅ Verify It's Working

1. Check backend: `curl http://localhost:3000/health`
2. Open app in simulator/device
3. Fill out the form and submit
4. Should connect to backend successfully

## 🐛 Common Issues

**Port 3000 in use:**
```bash
kill -9 $(lsof -ti:3000)
```

**Can't connect from device:**
- Use local IP instead of localhost
- Ensure same Wi-Fi network
- Check firewall settings

**Dependencies issues:**
```bash
# In both directories
rm -rf node_modules package-lock.json
npm install
```

---

📖 **Full Guide**: See `SETUP_BACKEND.md` for detailed instructions

