# Matterport Viewer - Phone Debugging Guide

## Quick Checklist

When you tap "View Matterport Scan" on your phone, check the console logs for these messages:

### ✅ Expected Logs (Working):
```
[RoomScan] handleStartScan called
[RoomScan] MatterportViewer available: true
[RoomScan] validateMatterportConfig available: true
[RoomScan] Validating Matterport config...
[RoomScan] Validation passed, showing viewer
[RoomScan] Rendering MatterportViewer
[MatterportViewer] WebView loaded successfully
[MatterportViewer] Rendering WebView with modelSid: ...
```

### ❌ Common Issues:

#### Issue 1: WebView Not Installed
**Logs you'll see:**
```
[MatterportViewer] react-native-webview not installed: ...
[MatterportViewer] WebView not available on native platform
```

**Fix:**
```bash
cd thermaliq-app-native
npx expo install react-native-webview
# Then restart Expo: npm start -- --clear
```

#### Issue 2: Matterport Config Not Set
**Logs you'll see:**
```
[RoomScan] Validation error: Matterport Application Key not configured
# OR
[RoomScan] Validation error: Model SID is required
```

**Fix:**
1. Open `src/config/matterport.js`
2. Set your Matterport credentials:
   ```javascript
   export const MATTERPORT_CONFIG = {
     APPLICATION_KEY: 'your-actual-key-here',
     DEFAULT_MODEL_SID: 'your-model-sid-here',
   };
   ```
3. Or use environment variables (recommended):
   ```bash
   # Create .env file in thermaliq-app-native/
   EXPO_PUBLIC_MATTERPORT_APP_KEY=your-key
   EXPO_PUBLIC_MATTERPORT_MODEL_SID=your-sid
   ```

#### Issue 3: Component Not Loading
**Logs you'll see:**
```
[RoomScan] MatterportViewer available: false
Matterport components not available: ...
```

**Fix:**
- Check if `src/components/matterport/MatterportViewer.jsx` exists
- Check if `src/config/matterport.js` exists
- Restart Expo: `npm start -- --clear`

## Step-by-Step Debugging

### Step 1: Check Console Logs
1. Open Expo Go on your phone
2. Open the app
3. Navigate to RoomScan screen
4. Tap "View Matterport Scan"
5. Check the console/terminal where Expo is running
6. Look for `[RoomScan]` and `[MatterportViewer]` logs

### Step 2: Check What You See on Phone

**If you see a black screen:**
- WebView might be loading (wait 10-15 seconds)
- Check console for WebView errors
- Check internet connection

**If you see an error message:**
- Read the message carefully
- It will tell you what's missing (WebView, config, etc.)

**If you see nothing happens:**
- Check console logs
- The validation might be failing silently
- Check if Alert is showing (might be behind the screen)

### Step 3: Verify Installation

```bash
# Check if react-native-webview is installed
cd thermaliq-app-native
npm list react-native-webview

# If not installed:
npx expo install react-native-webview

# Restart Expo
npm start -- --clear
```

### Step 4: Test with Demo Credentials

For testing, you can temporarily bypass validation:

1. Comment out validation in `RoomScan.jsx`:
   ```javascript
   // validateMatterportConfig(MATTERPORT_MODEL_SID);
   setShowViewer(true);
   ```

2. This will show the viewer even without valid credentials (will show error in viewer, but confirms WebView works)

## Common Solutions

### Solution 1: Install WebView
```bash
npx expo install react-native-webview
npm start -- --clear
```

### Solution 2: Configure Matterport
Edit `src/config/matterport.js` with your credentials.

### Solution 3: Restart Everything
```bash
# Stop Expo (Ctrl+C)
npm start -- --clear
# Reload app in Expo Go
```

### Solution 4: Check Network
- Make sure phone has internet connection
- Matterport viewer needs internet to load

## What to Share for Help

If still not working, share:
1. Console logs (especially `[RoomScan]` and `[MatterportViewer]` messages)
2. What you see on the phone screen
3. Whether WebView is installed: `npm list react-native-webview`
4. Whether Matterport config is set

---

**Most Common Issue:** `react-native-webview` not installed. Install it first!

