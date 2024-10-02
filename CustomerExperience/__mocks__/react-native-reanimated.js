// __mocks__/react-native-reanimated.js
import {Animated, View} from 'react-native';

export const Easing = {
  linear: jest.fn(),
};

export const FadeIn = {
  duration: jest.fn(),
};

export const FadeOut = {
  duration: jest.fn(),
};

export const FadeInUp = {
  duration: jest.fn(),
};

export const timing = Animated.timing;

export default {
  View: View,
  Value: Animated.Value,
  timing: Animated.timing,
  Easing: Easing,
  add: jest.fn(),
  subtract: jest.fn(),
  multiply: jest.fn(),
  divide: jest.fn(),
  modulo: jest.fn(),
  spring: jest.fn(),
  decay: jest.fn(),
  concat: jest.fn(),
  sequence: jest.fn(),
  delay: jest.fn(),
  event: jest.fn(),
  parallel: jest.fn(),
  stagger: jest.fn(),
  loop: jest.fn(),
  call: jest.fn(),
  stopClock: jest.fn(),
  startClock: jest.fn(),
  clockRunning: jest.fn(),
  set: jest.fn(),
  useCode: jest.fn(),
  onChange: jest.fn(),
  block: jest.fn(),
  cond: jest.fn(),
  eq: jest.fn(),
  neq: jest.fn(),
  ValueXY: jest.fn(),
  interpolateNode: jest.fn(),
  interpolate: jest.fn(),
  Extrapolate: {
    EXTEND: 'extend',
    CLAMP: 'clamp',
    IDENTITY: 'identity',
  },

  createAnimatedComponent: component => component,
};
