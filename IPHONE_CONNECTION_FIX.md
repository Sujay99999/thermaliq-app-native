# iPhone Connection Troubleshooting

## Problem: iPhone can't connect to Expo dev server

## Solution 1: Use Tunnel Mode (BEST for Hotspots) ⭐

Hotspots often block device-to-device connections. Tunnel mode routes through Expo's servers.

### Steps:
1. **Stop your current dev server** (Ctrl+C)
2. **Start with tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```
3. **Wait for the QR code** (may take 30-60 seconds)
4. **Scan with your iPhone** - it should work now!

**Note:** Tunnel mode is slower but works through any network, including hotspots.

---

## Solution 2: Use LAN Mode (If on Same WiFi)

If you're on a regular WiFi network (not hotspot):

1. **Get your Mac's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Look for something like `192.168.1.xxx` or `10.0.0.xxx`

2. **Start Expo:**
   ```bash
   npx expo start --lan
   ```

3. **Make sure firewall allows connections:**
   - System Settings > Network > Firewall
   - Allow Node.js/Expo through firewall

---

## Solution 3: Check Network Settings

### On Your Mac:
1. **Check if devices can see each other:**
   ```bash
   # Find your Mac's IP
   ipconfig getifaddr en0
   # or for WiFi
   ipconfig getifaddr en1
   ```

2. **Test connectivity from iPhone:**
   - Open Safari on iPhone
   - Go to: `http://YOUR_MAC_IP:8081`
   - Should see Expo dev tools page

### On Your iPhone:
1. **Make sure Expo Go is installed** from App Store
2. **Check WiFi connection** - make sure it's connected
3. **Try manual connection:**
   - Open Expo Go app
   - Tap "Enter URL manually"
   - Enter: `exp://YOUR_MAC_IP:8081`

---

## Solution 4: Use USB Connection (Most Reliable)

If you have a USB cable:

1. **Connect iPhone to Mac via USB**
2. **Trust the computer** on iPhone if prompted
3. **Start Expo:**
   ```bash
   npx expo start --ios
   ```
   This will automatically detect and install on your iPhone!

---

## Quick Diagnostic Commands

### Check if Metro bundler is accessible:
```bash
# On Mac, test if server is running
curl http://localhost:8081
```

### Check your Mac's IP:
```bash
# WiFi IP
ipconfig getifaddr en0

# Ethernet IP  
ipconfig getifaddr en1
```

### Check firewall:
```bash
# Check firewall status
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

---

## Common Issues & Fixes

### "Unable to connect to Metro"
- ✅ Use `--tunnel` flag
- ✅ Check firewall settings
- ✅ Make sure both devices on same network
- ✅ Try USB connection

### "Network request failed"
- ✅ Use tunnel mode
- ✅ Check if port 8081 is blocked
- ✅ Restart Expo server

### QR code not scanning
- ✅ Make sure Camera app has permissions
- ✅ Try manual URL entry in Expo Go
- ✅ Check QR code is clear and not cut off

### "Expo Go can't find the project"
- ✅ Make sure dev server is running
- ✅ Check network connection
- ✅ Try tunnel mode

---

## Recommended Approach for Your Situation

Since you're using a hotspot:

1. **Use Tunnel Mode** (most reliable):
   ```bash
   npx expo start --tunnel
   ```

2. **Or use USB** (fastest and most reliable):
   ```bash
   npx expo start --ios
   ```
   (iPhone must be connected via USB)

---

## Still Not Working?

1. **Restart everything:**
   - Close Expo Go on iPhone
   - Stop dev server (Ctrl+C)
   - Restart: `npx expo start --tunnel`

2. **Check Expo Go version:**
   - Make sure Expo Go is up to date in App Store

3. **Try different network:**
   - Switch to regular WiFi if possible
   - Or use USB connection

4. **Check Expo CLI version:**
   ```bash
   npx expo --version
   npm install -g expo-cli@latest
   ```

