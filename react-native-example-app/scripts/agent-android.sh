#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SDK_DIR="$(cd "$ROOT_DIR/../react-native-intercept-sdk" && pwd)"

echo "==> Step 1: Clean and rebuild react-native-intercept-sdk"
cd "$SDK_DIR"

echo "  -> Removing node_modules..."
rm -rf node_modules/

echo "  -> Removing android/build..."
rm -rf android/build/

echo "  -> Removing android/.gradle..."
rm -rf android/.gradle/

echo "  -> Cleaning npm cache..."
npm cache clean --force || echo "  [warn] npm cache clean failed, continuing..."

echo "  -> Running npm install..."
npm install

echo "  -> Running bob build..."
npx bob build

echo "==> Step 2: Clean and reinstall react-native-example-app"
cd "$ROOT_DIR"

echo "  -> Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "  -> Running npm install..."
npm install

echo "==> Step 3: Run Android"

# Check if Metro JS server is already running (default port 8081)
if lsof -iTCP:8081 -sTCP:LISTEN -t &>/dev/null; then
  echo "  -> Metro JS server already running on port 8081."
else
  echo "  -> Metro JS server not running. Starting it in background..."
  npx react-native start --reset-cache &
  METRO_PID=$!
  echo "  -> Waiting for Metro to be ready..."
  for i in $(seq 1 30); do
    if lsof -iTCP:8081 -sTCP:LISTEN -t &>/dev/null; then
      echo "  -> Metro is ready."
      break
    fi
    sleep 1
  done
  if ! lsof -iTCP:8081 -sTCP:LISTEN -t &>/dev/null; then
    echo "  [error] Metro did not start within 30 seconds. Aborting."
    kill "$METRO_PID" 2>/dev/null || true
    exit 1
  fi
fi

npx react-native run-android




#!/bin/bash

# ─────────────────────────────────────────────
# React Native Library Build Agent — Android
# ─────────────────────────────────────────────

#claude --allowedTools "Bash,Edit,Write" "
#You are a React Native build agent. Do the following in order:

# Step 1: Clean and build the library
#Go to ../my-library and run these commands one by one:
 #  - rm -rf node_modules/        # Remove old dependencies
  # - rm -rf android/build/       # Remove old Android build artifacts
   #- rm -rf android/.gradle/     # Clear Gradle cache
   #- npm cache clean --force     # Clear npm cache
   #- npm install                 # Install fresh dependencies
   #- npx bob build               # Build the library using bob

# Step 2: Clean and reinstall demo app dependencies
#Come back to demo-app and run these commands one by one:
   #- rm -rf node_modules/        # Remove old dependencies
   #- rm -rf package-lock.json    # Remove lock file to avoid stale cache
   #- npm install                 # Install fresh dependencies including updated library

# Step 3: Run the app
#Run npx react-native run-android  # Launch the app on Android emulator or device

#If any step fails, stop immediately and tell me what went wrong.
#"