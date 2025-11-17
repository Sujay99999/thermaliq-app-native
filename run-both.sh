#!/bin/bash

# Script to run both backend and native app together
# Usage: ./run-both.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$HOME/Desktop/thermaliq-backend"
APP_DIR="$SCRIPT_DIR"

echo -e "${BLUE}🚀 Starting THERMSOL.ai Development Environment${NC}\n"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}⚠️  Backend directory not found at: $BACKEND_DIR${NC}"
    echo -e "${YELLOW}   Please ensure the backend is located at Desktop/thermaliq-backend${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $BACKEND_PID $APP_PID 2>/dev/null || true
    wait $BACKEND_PID $APP_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Services stopped${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${BLUE}📦 Starting backend server...${NC}"
cd "$BACKEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing backend dependencies...${NC}"
    npm install
fi

# Start backend in background
npm run dev > /tmp/thermaliq-backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Backend failed to start. Check /tmp/thermaliq-backend.log${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend running (PID: $BACKEND_PID)${NC}"
echo -e "   Logs: /tmp/thermaliq-backend.log"
echo -e "   URL: http://localhost:3000\n"

# Start app
echo -e "${BLUE}📱 Starting React Native app...${NC}"
cd "$APP_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing app dependencies...${NC}"
    npm install
fi

# Start Expo in foreground (so we can see output)
echo -e "${GREEN}✅ App starting...${NC}"
echo -e "${YELLOW}   Press Ctrl+C to stop both services${NC}\n"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

npm start &
APP_PID=$!

# Wait for both processes
wait $BACKEND_PID $APP_PID

