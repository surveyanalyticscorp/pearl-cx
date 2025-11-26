// __mocks__/react-native-reanimated.js
import {Animated, View} from 'react-native';

// Define the class for v1.x compatibility
class MockAnimatedValue {
  constructor(value = 0) {
    this._value = value;
    this.value = value;
    this._listeners = [];
    this._offset = 0;
  }

  setValue(value) {
    this._value = value;
    this.value = value;
    this._listeners.forEach(listener => listener({value}));
    return this;
  }

  addListener(callback) {
    this._listeners.push(callback);
    return this._listeners.length.toString();
  }

  removeListener(id) {
    const index = parseInt(id) - 1;
    if (index >= 0 && index < this._listeners.length) {
      this._listeners.splice(index, 1);
    }
    return this;
  }

  removeAllListeners() {
    this._listeners = [];
    return this;
  }

  stopAnimation(callback) {
    if (callback) {
      callback();
    }
    return this;
  }

  resetAnimation(callback) {
    if (callback) {
      callback();
    }
    return this;
  }

  interpolate(config) {
    return new MockAnimatedValue(0);
  }

  extractOffset() {
    this._offset += this.value;
    this.value = 0;
    return this;
  }

  setOffset(offset) {
    this._offset = offset;
    return this;
  }

  flattenOffset() {
    this.value += this._offset;
    this._offset = 0;
    return this;
  }

  add(other) {
    return new MockAnimatedValue(this.value + (other.value || other));
  }

  multiply(other) {
    return new MockAnimatedValue(this.value * (other.value || other));
  }
}

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
  Value: MockAnimatedValue,
  timing: Animated.timing,
  Easing: Easing,
  add: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  subtract: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  multiply: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  divide: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  modulo: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
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
  ScrollView: jest.fn().mockImplementation(({children}) => children),

  Extrapolate: {
    EXTEND: 'extend',
    CLAMP: 'clamp',
    IDENTITY: 'identity',
  },

  createAnimatedComponent: component => component,
};

// Export the default object again to make sure it's the proper default export
module.exports = {
  View: View,
  Value: MockAnimatedValue,
  timing: Animated.timing,
  Easing: Easing,
  add: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  subtract: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  multiply: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  divide: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
  modulo: jest.fn().mockImplementation(() => new MockAnimatedValue(0)),
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
  ScrollView: jest.fn().mockImplementation(({children}) => children),

  Extrapolate: {
    EXTEND: 'extend',
    CLAMP: 'clamp',
    IDENTITY: 'identity',
  },

  createAnimatedComponent: component => component,
};
