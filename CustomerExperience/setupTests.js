import React from 'react';
import 'react-native';
import {JSDOM} from 'jsdom';
import fetchMock from 'jest-fetch-mock';
import {NativeModules, Platform} from 'react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import '@jest/globals';

// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

global.document = new JSDOM();
global.window = document.defaultView;
global.setImmediate =
  global.setImmediate ||
  function (fn) {
    return setTimeout(fn, 0);
  };

jest.mock('react-native-notifications');
jest.mock('react-native-device-info');

NativeModules.ReactNativeReanimated = {
  ...NativeModules.ReactNativeReanimated,
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

// Mock native modules to prevent errors in Jest
NativeModules.RNGestureHandlerModule = {
  State: {BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END'},
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
};
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

fetchMock.enableMocks();

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});
