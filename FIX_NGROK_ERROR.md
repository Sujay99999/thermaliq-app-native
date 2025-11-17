# Fix Ngrok Tunnel Error

## Error
```
HTTP response error 404: The endpoint fxbwcm8-sujay99999-8081.exp.direct is offline.
ERR_NGROK_3200
```

## Problem
The ngrok tunnel expired or failed. This happens when using `--tunnel` mode.

## Solution: Use LAN Mode Instead

Since your IP is correctly configured (`10.189.36.47`), use LAN mode instead of tunnel:

### Step 1: Stop Current Server
```bash
# Press Ctrl+C in the terminal running Expo
# Or kill the process
```

### Step 2: Start with LAN Mode
```bash
cd thermaliq-app-native
npx expo start --lan
```

### Step 3: Connect from iPhone
1. Open Expo Go app
2. Scan the QR code (should show `exp://10.189.36.47:8081`)
3. Or manually enter: `exp://10.189.36.47:8081`

---

## Alternative: Use USB (Most Reliable)

If LAN doesn't work:

```bash
# 1. Connect iPhone to Mac via USB
# 2. Trust computer on iPhone if prompted
# 3. Run:
npx expo start --ios
```

This automatically installs and runs on your iPhone!

---

## Why Tunnel Failed

- Ngrok tunnels expire after some time
- Network issues can break tunnel
- Tunnel mode is slower and less reliable than LAN

## Why LAN Should Work

- Your IP is correctly set: `10.189.36.47`
- Backend is accessible from network
- Metro is accessible from network
- Same WiFi network = direct connection (faster!)

---

## If LAN Still Doesn't Work

1. **Check both devices on same WiFi:**
   - iPhone Settings > WiFi
   - Mac System Settings > Network

2. **Check firewall:**
   - System Settings > Network > Firewall
   - Allow Node.js through firewall

3. **Test connectivity:**
   - On iPhone Safari: `http://10.189.36.47:8081`
   - Should see Expo dev tools

4. **Use USB instead:**
   ```bash
   npx expo start --ios
   ```

