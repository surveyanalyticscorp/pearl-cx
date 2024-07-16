import React from 'react';
import 'react-native';
import 'react-native-mock-render/mock';
import {JSDOM} from 'jsdom';
import {configure} from 'enzyme';
// import jest from 'jest';
import Adapter from 'enzyme-adapter-react-16';
// import 'react-native-gesture-handler/jestSetup';

global.document = new JSDOM();
global.window = document.defaultView;
global.fetch = require('jest-fetch-mock');

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

configure({adapter: new Adapter()});
