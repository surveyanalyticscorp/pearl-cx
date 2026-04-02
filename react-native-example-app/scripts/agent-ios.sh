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

echo "==> Step 3: Fix boost.podspec source"
BOOST_PODSPEC="$ROOT_DIR/node_modules/react-native/third-party-podspecs/boost.podspec"

if [ ! -f "$BOOST_PODSPEC" ]; then
  echo "  [error] boost.podspec not found at $BOOST_PODSPEC"
  exit 1
fi

echo "  -> Patching boost.podspec..."
perl -i -0pe 's/spec\.source\s*=\s*\{[^}]*\}/spec.source = { :http => '"'"'https:\/\/archives.boost.io\/release\/1.76.0\/source\/boost_1_76_0.tar.bz2'"'"', :sha256 => '"'"'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41'"'"' }/s' "$BOOST_PODSPEC"
echo "  -> boost.podspec patched."

echo "==> Step 4: Clean and run pod install"
cd "$ROOT_DIR/ios"

echo "  -> Removing Pods and Podfile.lock..."
rm -rf Pods Podfile.lock

echo "  -> Running pod install..."
pod install

echo "==> Step 5: Run iOS"
cd "$ROOT_DIR"
npx react-native run-ios
