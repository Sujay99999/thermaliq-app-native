# Matterport SDK Quick Start Guide

## ✅ Implementation Complete

The Matterport SDK has been integrated into your React Native app. Here's what was created:

### Files Created/Modified:

1. **`src/components/matterport/MatterportViewer.jsx`** - Main Matterport viewer component
2. **`src/config/matterport.js`** - Configuration file for Matterport credentials
3. **`src/screens/RoomScan.jsx`** - Updated to use Matterport viewer
4. **`MATTERPORT_IMPLEMENTATION_GUIDE.md`** - Detailed implementation guide

## 🚀 Next Steps to Get It Working

### Step 1: Install WebView Dependency

```bash
cd thermaliq-app-native
npx expo install react-native-webview
```

### Step 2: Get Matterport Credentials

1. **Sign up for Matterport account:**
   - Go to https://matterport.com
   - Create a free account (free tier allows 1 active space)

2. **Get Application Key:**
   - Log into your Matterport account
   - Go to **Settings** → **Developer Tools**
   - Request an **SDK Application Key**
   - Copy the key

3. **Get Model SID (Space ID):**
   - Download **Matterport Capture** app on iOS/Android
   - Scan a room using the app (walk around with your phone)
   - After scanning, you'll get a Model SID (Space ID)
   - Copy the Model SID

### Step 3: Configure Credentials

Edit `src/config/matterport.js`:

```javascript
export const MATTERPORT_CONFIG = {
  APPLICATION_KEY: 'YOUR_ACTUAL_APPLICATION_KEY_HERE',
  DEFAULT_MODEL_SID: 'YOUR_ACTUAL_MODEL_SID_HERE', // Optional, can be set dynamically
};
```

**OR** use environment variables (recommended for production):

Create `.env` file:
```
EXPO_PUBLIC_MATTERPORT_APP_KEY=your_application_key_here
EXPO_PUBLIC_MATTERPORT_MODEL_SID=your_model_sid_here
```

### Step 4: Test the Integration

1. Start your app:
   ```bash
   npm start
   ```

2. Navigate to the **RoomScan** screen

3. Click **"View Matterport Scan"**

4. The Matterport viewer should load (if credentials are correct)

## 📋 How It Works

1. **User clicks "View Matterport Scan"** → Opens Matterport viewer
2. **WebView loads** → Embeds Matterport SDK in an iframe
3. **SDK connects** → Communicates with Matterport servers
4. **3D model displays** → User can interact with the 3D scan

## ⚠️ Important Notes

### Limitations:
- **Requires Matterport Capture app** to create scans (not simple photo upload)
- **Free tier limited** to 1 active space
- **Internet connection required** to load viewer
- **Model SID needed** for each scan you want to view

### What Matterport Does:
- ✅ Creates 3D virtual tours from 360° scans
- ✅ Provides accurate measurements
- ✅ Generates floor plans (paid feature)
- ✅ Interactive 3D walkthrough

### What Matterport Does NOT Do:
- ❌ Simple photo upload → floor plan
- ❌ Instant results (requires scanning process)
- ❌ Free floor plans (requires paid subscription)

## 🔧 Troubleshooting

### "Missing Model SID or Application Key"
- Check `src/config/matterport.js` has correct credentials
- Verify environment variables are set (if using them)

### "Failed to load Matterport viewer"
- Check internet connection
- Verify Application Key is correct
- Verify Model SID is correct and active
- Check Matterport account status

### WebView not loading
- Ensure `react-native-webview` is installed
- For iOS: Run `cd ios && pod install`
- Restart Metro bundler

## 📚 Additional Resources

- **Full Implementation Guide:** `MATTERPORT_IMPLEMENTATION_GUIDE.md`
- **Research Notes:** `MATTERPORT_RESEARCH.md`
- **Matterport Docs:** https://matterport.github.io/showcase-sdk/
- **Matterport Plans:** https://matterport.com/plans

## 🎯 Alternative Approaches

If Matterport doesn't fit your needs, consider:

1. **Apple RoomPlan** (iOS only, LiDAR required)
2. **ARCore** (Google, cross-platform)
3. **Custom ML solution** (photo upload → measurements)
4. **Manual input** (current fallback option)

---

**Ready to test?** Install WebView, add your credentials, and try it out! 🚀

