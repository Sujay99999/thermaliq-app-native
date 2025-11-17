#!/bin/bash

echo "🔍 iPhone Connection Diagnostic Tool"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this from thermaliq-app-native directory"
    exit 1
fi

echo "1️⃣  Checking Network Configuration..."
echo "-----------------------------------"

# Get local IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Not found")
echo "   Your Mac's IP: $LOCAL_IP"

# Check if IP is set in api.js
API_IP=$(grep -o "const LOCAL_IP = \"[^\"]*\"" src/services/api.js | cut -d'"' -f2)
echo "   IP in api.js: $API_IP"

if [ "$API_IP" != "$LOCAL_IP" ] && [ "$API_IP" != "null" ]; then
    echo "   ⚠️  WARNING: IP in api.js doesn't match your Mac's IP!"
    echo "   Update src/services/api.js: const LOCAL_IP = \"$LOCAL_IP\";"
fi

echo ""
echo "2️⃣  Checking Backend Server..."
echo "-----------------------------------"

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 3000"
    BACKEND_STATUS=$(curl -s http://localhost:3000/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "   Backend status: $BACKEND_STATUS"
else
    echo "   ❌ Backend is NOT running on port 3000"
    echo "   Start it with: cd ../thermaliq-backend && npm run dev"
fi

# Check if backend is accessible from network IP
if [ "$LOCAL_IP" != "Not found" ] && [ "$LOCAL_IP" != "" ]; then
    if curl -s http://$LOCAL_IP:3000/health > /dev/null 2>&1; then
        echo "   ✅ Backend is accessible from network IP ($LOCAL_IP)"
    else
        echo "   ⚠️  Backend might not be accessible from network IP"
        echo "   Check firewall settings"
    fi
fi

echo ""
echo "3️⃣  Checking Expo/Metro..."
echo "-----------------------------------"

# Check if Metro is running
if lsof -ti:8081 > /dev/null 2>&1; then
    echo "   ✅ Metro bundler is running on port 8081"
else
    echo "   ❌ Metro bundler is NOT running"
    echo "   Start it with: npm start"
fi

# Check if port 8081 is accessible
if [ "$LOCAL_IP" != "Not found" ] && [ "$LOCAL_IP" != "" ]; then
    if curl -s http://$LOCAL_IP:8081 > /dev/null 2>&1; then
        echo "   ✅ Metro is accessible from network IP"
    else
        echo "   ⚠️  Metro might not be accessible from network IP"
    fi
fi

echo ""
echo "4️⃣  Checking Dependencies..."
echo "-----------------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules installed"
else
    echo "   ❌ node_modules not found - run: npm install"
fi

# Check if expo is installed
if [ -f "node_modules/.bin/expo" ]; then
    EXPO_VERSION=$(node_modules/.bin/expo --version 2>/dev/null || echo "unknown")
    echo "   ✅ Expo installed (version: $EXPO_VERSION)"
else
    echo "   ❌ Expo not found - run: npm install"
fi

echo ""
echo "5️⃣  Quick Fixes to Try..."
echo "-----------------------------------"
echo ""
echo "   If Metro not accessible:"
echo "   → npx expo start --tunnel"
echo ""
echo "   If backend not accessible:"
echo "   → Check firewall: System Settings > Network > Firewall"
echo "   → Allow Node.js through firewall"
echo ""
echo "   If IP mismatch:"
echo "   → Update src/services/api.js:"
echo "     const LOCAL_IP = \"$LOCAL_IP\";"
echo ""
echo "   If nothing works:"
echo "   → Use USB: npx expo start --ios (with iPhone connected)"
echo "   → Or use tunnel: npx expo start --tunnel"
echo ""

echo "✅ Diagnostic complete!"
echo ""

