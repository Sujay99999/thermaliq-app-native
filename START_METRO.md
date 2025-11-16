# Fix "No script URL provided" Error

This error means the app can't connect to Metro bundler. Follow these steps:

## Step 1: Start Metro Bundler

Open a **new terminal window** and run:

```bash
cd /Users/sujayjami/Desktop/thermaliq-app-native
npx expo start --dev-client --tunnel
```

**Important**: 
- Keep this terminal open and visible
- Wait for Metro to fully start (you'll see "Metro waiting on...")
- Look for the connection URL (exp:// or https://)

## Step 2: Connect the App

After Metro starts:

1. **On your iPhone**: Open the app
2. **Shake your iPhone** (or swipe down from top on newer iPhones)
3. **Tap "Configure Bundler"** or **"Enter URL manually"**
4. **Enter the URL** from Metro terminal (or use auto-detect)

OR

The app should **auto-detect** Metro if:
- iPhone and Mac are on the same WiFi network
- Or you're using tunnel mode (--tunnel flag)

## Step 3: Verify Connection

You should see in Metro terminal:
- "Bundling..." messages
- Connection from your device
- No errors

## Alternative: If Auto-Detect Doesn't Work

If the app doesn't auto-connect:

1. **Get the URL from Metro terminal**:
   - Look for `exp://` or `https://` URL
   - Example: `exp://192.168.1.100:8081` or `https://abc123.exp.direct`

2. **In the app**:
   - Shake device → Dev Menu
   - Tap "Configure Bundler"
   - Enter the URL manually

## Troubleshooting

### Metro won't start
```bash
# Kill any existing Metro processes
killall -9 node

# Clear Metro cache
npx expo start --dev-client --tunnel --clear
```

### Still can't connect
1. Make sure iPhone and Mac are on same network (or use tunnel)
2. Check firewall isn't blocking port 8081
3. Try tunnel mode: `npx expo start --dev-client --tunnel`
4. Restart the app on iPhone

### Network Issues
If on different networks (e.g., hotspot):
- Use `--tunnel` flag (requires ngrok)
- Or connect iPhone and Mac to same WiFi

