#!/bin/bash

# Fix Worklets Version Mismatch and iOS Simulator Issues

echo "🔧 Fixing Worklets version mismatch and iOS build issues..."

cd "$(dirname "$0")"

# Step 1: Clean iOS build artifacts
echo "📦 Cleaning iOS build artifacts..."
cd ios
rm -rf Pods Podfile.lock build DerivedData
echo "✅ iOS build artifacts cleaned"

# Step 2: Clean node modules (optional - uncomment if needed)
# echo "📦 Cleaning node_modules..."
# cd ..
# rm -rf node_modules
# npm install
# echo "✅ Node modules reinstalled"

# Step 3: Reinstall CocoaPods
echo "📦 Reinstalling CocoaPods..."
cd ios
pod install
echo "✅ CocoaPods reinstalled"

# Step 4: Clean Metro bundler cache
echo "🧹 Cleaning Metro bundler cache..."
cd ..
npx expo start --clear &
EXPO_PID=$!

# Wait a moment for Expo to start
sleep 3

echo ""
echo "✅ Fix complete!"
echo ""
echo "Next steps:"
echo "1. Stop the current Expo process (Ctrl+C if running)"
echo "2. Run: npx expo start --ios"
echo ""
echo "If simulator still times out:"
echo "- Close Simulator: killall Simulator"
echo "- Reset Simulator: Device → Erase All Content and Settings"
echo "- Try again: npx expo start --ios"

# Kill Expo if it's still running
kill $EXPO_PID 2>/dev/null || true

