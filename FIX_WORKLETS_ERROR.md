# Fix Worklets Version Mismatch Error

## Error
```
ERROR [runtime not ready]: WorkletsError: [Worklets] Mismatch between JavaScript part and native part of Worklets (0.6.1 vs 0.5.1).
```

## Solution

The JavaScript side has `react-native-worklets` 0.6.1, but the native iOS side has 0.5.1. We need to sync them.

### Step 1: Clean iOS Build

```bash
cd thermaliq-app-native/ios
rm -rf Pods Podfile.lock
cd ..
```

### Step 2: Reinstall Pods

```bash
cd thermaliq-app-native/ios
pod install
cd ..
```

### Step 3: Clean Metro Cache

```bash
cd thermaliq-app-native
npx expo start --clear
```

### Step 4: Rebuild iOS App

```bash
# Stop the current process (Ctrl+C)
# Then restart:
npx expo start --ios
```

## Alternative: If Above Doesn't Work

### Option 1: Force Reinstall Worklets

```bash
cd thermaliq-app-native
npm uninstall react-native-worklets
npm install react-native-worklets@0.5.1
cd ios
pod install
cd ..
npx expo start --clear --ios
```

### Option 2: Update to Match Native Version

If native has 0.5.1, downgrade JS to match:

```bash
cd thermaliq-app-native
npm install react-native-worklets@0.5.1 --save-exact
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx expo start --clear --ios
```

## For iOS Simulator Timeout

If simulator still times out:

1. **Close Simulator:**
   ```bash
   killall Simulator
   ```

2. **Reset Simulator:**
   - Open Simulator
   - Device → Erase All Content and Settings

3. **Try Again:**
   ```bash
   npx expo start --ios
   ```

## Quick Fix Commands

Run these in order:

```bash
# 1. Clean iOS
cd thermaliq-app-native/ios
rm -rf Pods Podfile.lock build
cd ..

# 2. Clean node modules (optional but recommended)
rm -rf node_modules
npm install

# 3. Reinstall pods
cd ios
pod install
cd ..

# 4. Clear cache and restart
npx expo start --clear --ios
```

