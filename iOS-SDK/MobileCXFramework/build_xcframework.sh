#!/bin/bash
set -e

SCHEME="QuestionProCXFramework"
CONFIGURATION="Release"

ROOT_DIR="$(pwd)"
OUTPUT_DIR="$ROOT_DIR/output"

IOS_ARCHIVE="$OUTPUT_DIR/ios"
SIM_ARCHIVE="$OUTPUT_DIR/ios-simulator"

XCFRAMEWORK_NAME="QuestionProCXFramework.xcframework"
XCFRAMEWORK_OUTPUT_PATH="$OUTPUT_DIR/$XCFRAMEWORK_NAME"

echo "Cleaning previous builds..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "Archiving iOS (device)..."
xcodebuild archive \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "generic/platform=iOS" \
  -archivePath "$IOS_ARCHIVE" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

echo "Archiving iOS Simulator..."
xcodebuild archive \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "generic/platform=iOS Simulator" \
  -archivePath "$SIM_ARCHIVE" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

echo "Creating XCFramework..."
rm -rf "$XCFRAMEWORK_OUTPUT_PATH"

xcodebuild -create-xcframework \
  -framework "$IOS_ARCHIVE.xcarchive/Products/Library/Frameworks/QuestionProCXFramework.framework" \
  -framework "$SIM_ARCHIVE.xcarchive/Products/Library/Frameworks/QuestionProCXFramework.framework" \
  -output "$XCFRAMEWORK_OUTPUT_PATH"

echo "XCFramework successfully created at:"
echo "$XCFRAMEWORK_OUTPUT_PATH"
