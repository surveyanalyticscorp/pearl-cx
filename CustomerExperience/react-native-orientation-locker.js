// react-native-orientation-locker.mock.js
import React from 'react';
import jest from 'jest';
// import {MarginConstants} from '../CustomerExperience/app/styles/margin.constants';
jest.mock('react-native-orientation-locker', () => ({
  // Enum types (optional, mock if needed in your tests)
  OrientationType: {
    PORTRAIT: 'PORTRAIT',
    // ... other enum values
  },

  // Constants (optional, mock if needed in your tests)
  UNLOCK: 'UNLOCK',
  PORTRAIT: 'PORTRAIT',
  // ... other constants

  // Mock static functions
  addOrientationListener: jest.fn(),
  removeOrientationListener: jest.fn(),
  addDeviceOrientationListener: jest.fn(),
  removeDeviceOrientationListener: jest.fn(),
  addLockListener: jest.fn(),
  removeLockListener: jest.fn(),
  removeAllListeners: jest.fn(),
  getInitialOrientation: jest.fn(() => 'PORTRAIT'), // Default to portrait
  isLocked: jest.fn(() => false), // Default to unlocked

  // Mock lock functions (adjust return values as needed)
  lockToPortrait: jest.fn(),
  lockToLandscape: jest.fn(),
  lockToLandscapeLeft: jest.fn(),
  lockToAllOrientationsButUpsideDown: jest.fn(),
  lockToLandscapeRight: jest.fn(),
  lockToPortraitUpsideDown: jest.fn(),
  unlockAllOrientations: jest.fn(),

  getOrientation: jest.fn(callback => callback('PORTRAIT')), // Default to portrait
  getDeviceOrientation: jest.fn(callback => callback('PORTRAIT')), // Default to portrait
  getAutoRotateState: jest.fn(callback => callback(true)), // Default to auto-rotate enabled

  // Mocked React hooks (optional, mock if used)
  useOrientationChange: jest.fn(),
  useDeviceOrientationChange: jest.fn(),
  useLockListener: jest.fn(),

  // We don't mock the default export (Orientation) as it's a class
  // with static functions (already mocked above)
}));
