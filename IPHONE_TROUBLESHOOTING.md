# iPhone Not Working - Troubleshooting Guide

## ✅ Diagnostic Results

Your setup looks correct:
- ✅ IP address matches (10.189.36.47)
- ✅ Backend is running and accessible
- ✅ Metro bundler is running
- ✅ Dependencies installed

## Common Issues & Solutions

### Issue 1: Expo Go Can't Connect to Metro

**Symptoms:**
- "Unable to connect to Metro"
- "Network request failed"
- QR code scans but app doesn't load

**Solutions:**

#### Solution A: Use Tunnel Mode (Recommended)
```bash
# Stop current server (Ctrl+C)
npx expo start --tunnel
```
This routes through Expo's servers and works even on different networks.

#### Solution B: Check Network Connection
1. Make sure iPhone and Mac are on **same WiFi network**
2. If using hotspot, use tunnel mode instead
3. Try restarting WiFi on both devices

#### Solution C: Manual Connection
1. Open Expo Go app on iPhone
2. Tap "Enter URL manually"
3. Enter: `exp://10.189.36.47:8081`

---

### Issue 2: App Loads But Shows Errors

**Symptoms:**
- App opens but shows red error screen
- "Network request failed" in app
- Can't submit form

**Solutions:**

#### Check Backend Connection
1. Open Safari on iPhone
2. Go to: `http://10.189.36.47:3000/health`
3. Should see: `{"status":"ok",...}`
4. If not, backend isn't accessible from iPhone

#### Fix Backend Access:
```bash
# Make sure backend is running
cd ../thermaliq-backend
npm run dev

# Check firewall allows connections
# System Settings > Network > Firewall > Allow Node.js
```

---

### Issue 3: App Crashes Immediately

**Symptoms:**
- App opens then immediately closes
- White screen then crash

**Solutions:**

#### Clear Expo Go Cache
1. Delete Expo Go app from iPhone
2. Reinstall from App Store
3. Try connecting again

#### Clear Metro Cache
```bash
# Stop server (Ctrl+C)
npx expo start --clear
```

#### Check for JavaScript Errors
Look at the terminal where `npm start` is running - any red errors?

---

### Issue 4: Can't Scan QR Code

**Symptoms:**
- QR code doesn't scan
- Camera doesn't recognize QR code

**Solutions:**

1. **Use Camera app** (not Expo Go's scanner):
   - Open iPhone Camera app
   - Point at QR code
   - Tap notification to open in Expo Go

2. **Manual entry**:
   - Open Expo Go
   - Tap "Enter URL manually"
   - Enter: `exp://10.189.36.47:8081`

3. **Check QR code is complete**:
   - Make sure entire QR code is visible
   - Try zooming out terminal window

---

### Issue 5: "Network request failed" When Submitting Form

**Symptoms:**
- Form works but submission fails
- Loading screen shows then error

**Solutions:**

#### Verify Backend is Accessible
```bash
# Test from iPhone's network
# Open Safari on iPhone and go to:
http://10.189.36.47:3000/health
```

#### Check API Configuration
The IP in `src/services/api.js` should be: `10.189.36.47`

#### Check Console Logs
Look for `[API]` messages in the terminal - they'll show what's failing.

---

## Quick Fix Checklist

Run through these in order:

1. ✅ **Backend is running?**
   ```bash
   cd ../thermaliq-backend
   npm run dev
   ```

2. ✅ **Metro is running?**
   ```bash
   cd thermaliq-app-native
   npm start
   ```

3. ✅ **Same WiFi network?**
   - Check iPhone WiFi settings
   - Check Mac WiFi settings
   - If different, use tunnel mode

4. ✅ **Firewall allows connections?**
   - System Settings > Network > Firewall
   - Allow Node.js/Expo through

5. ✅ **Try tunnel mode?**
   ```bash
   npx expo start --tunnel
   ```

6. ✅ **Try USB connection?**
   ```bash
   # Connect iPhone via USB
   npx expo start --ios
   ```

---

## Most Common Solution

**90% of iPhone connection issues are solved by:**

```bash
# Stop current server (Ctrl+C)
npx expo start --tunnel
```

Then scan the QR code again. Tunnel mode works even if devices are on different networks.

---

## Still Not Working?

1. **Check Expo Go version:**
   - Make sure it's up to date in App Store

2. **Check Expo CLI version:**
   ```bash
   npx expo --version
   npm install -g expo-cli@latest
   ```

3. **Check iPhone iOS version:**
   - Needs iOS 13+ for Expo Go

4. **Try different network:**
   - Switch to regular WiFi (not hotspot)
   - Or use USB connection

5. **Share error messages:**
   - What do you see on iPhone screen?
   - What errors in terminal?
   - What happens when you tap "View Matterport Scan"?

---

## Test Backend from iPhone

1. Open Safari on iPhone
2. Go to: `http://10.189.36.47:3000/health`
3. Should see JSON response
4. If not, backend isn't accessible (firewall/network issue)

---

## Test Metro from iPhone

1. Open Safari on iPhone  
2. Go to: `http://10.189.36.47:8081`
3. Should see Expo dev tools
4. If not, Metro isn't accessible (firewall/network issue)

