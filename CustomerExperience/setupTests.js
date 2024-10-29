import React from 'react';
import 'react-native';
import 'react-native-mock-render/mock';
import {JSDOM} from 'jsdom';
import {configure} from 'enzyme';
// import jest from 'jest';
import Adapter from 'enzyme-adapter-react-16';
// import 'react-native-gesture-handler/jestSetup';
import fetchMock from 'jest-fetch-mock';
import {NativeModules, Platform} from 'react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

global.document = new JSDOM();
global.window = document.defaultView;
global.setImmediate =
  global.setImmediate ||
  function (fn) {
    return setTimeout(fn, 0);
  };

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native-notifications');
jest.mock('react-native-device-info');

// jest.mock('@react-native-async-storage/async-storage', () =>
//   require('./__mocks__/async-storage'),
// );
// jest.mock('react-native-reanimated', () =>
//   require('react-native-reanimated/mock'),
// );
// jest.mock('rn-fetch-blob', () => require('./__mocks__/rn-fetch-blob.js'));

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

// jest.mock('reanimated-bottom-sheet', () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       snapTo: jest.fn(),
//     };
//   });
// });

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

configure({adapter: new Adapter()});
