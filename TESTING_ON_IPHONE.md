# Testing on Physical iPhone

## Option 1: Quick Demo (Without AR Room Scanning) - Expo Go

**Best for:** Quick demo of forms, navigation, results (AR won't work)

### Steps:
1. **Install Expo Go** on your iPhone from the App Store
2. **Make sure your iPhone and computer are on the same WiFi network**
3. **Start the dev server:**
   ```bash
   npm start
   ```
4. **Scan the QR code** that appears in the terminal with:
   - **iOS**: Use the Camera app (it will open Expo Go automatically)
   - Or open Expo Go app and scan the QR code manually
5. The app will load on your iPhone!

**Note:** Room scanning won't work in Expo Go, but everything else will.

---

## Option 2: Full Demo (With AR Room Scanning) - Development Build

**Best for:** Complete demo including AR room scanning

### Prerequisites:
- Xcode installed on your Mac
- Apple Developer account (free account works for development)
- iPhone connected via USB (or same WiFi)

### Steps:

#### A. Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

#### B. Login to Expo
```bash
eas login
```
(Or create account: `eas register`)

#### C. Configure the project
```bash
eas build:configure
```

#### D. Build for iOS (Development Build)

**Option D1: Local Build (Faster, requires Xcode)**
```bash
# Install iOS dependencies
npx expo prebuild --platform ios

# Open in Xcode
open ios/thermaliqappnative.xcworkspace

# In Xcode:
# 1. Select your iPhone as the target device (top bar)
# 2. Click the Play button to build and install
# 3. Trust the developer certificate on your iPhone:
#    Settings > General > VPN & Device Management > Trust Developer
```

**Option D2: Cloud Build (Easier, but takes ~15-20 minutes)**
```bash
eas build --profile development --platform ios
```
This will:
- Build the app in the cloud
- Give you a download link
- Install via TestFlight or direct download

#### E. Run the Development Build
After installing the development build on your iPhone:

```bash
# Start the dev server
npm start -- --dev-client

# Or
npx expo start --dev-client
```

The app will connect to your dev server and you'll have full functionality including AR scanning!

---

## Quick Comparison

| Feature | Expo Go | Development Build |
|---------|---------|-------------------|
| Setup Time | 2 minutes | 15-30 minutes |
| Forms & Navigation | ✅ | ✅ |
| Results & Charts | ✅ | ✅ |
| AR Room Scanning | ❌ | ✅ |
| Requires Xcode | ❌ | ✅ (for local) |
| Requires Apple Dev Account | ❌ | ✅ (free account OK) |

---

## Troubleshooting

### "Unable to connect to Metro"
- Make sure iPhone and computer are on same WiFi
- Check firewall settings
- Try: `npx expo start --tunnel` (slower but more reliable)

### "Development build not connecting"
- Make sure you're using `--dev-client` flag
- Restart the dev server
- Rebuild the app if needed

### "AR scanning not working"
- Make sure you're using a development build (not Expo Go)
- Check iOS version (needs iOS 16+)
- Grant camera permissions when prompted

---

## For Your Demo

**If you need AR scanning:** Use Option 2 (Development Build)
**If you just need to show the app flow:** Use Option 1 (Expo Go) - much faster!

The app is now web-safe, so you can test everything except AR on web first, then use Expo Go for quick iPhone testing, or build a dev build for the full experience.

