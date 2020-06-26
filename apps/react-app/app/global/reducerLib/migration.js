'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createMigration;

var _constants = require('redux-persist/constants');

var processKey = function processKey(key) {
  var int = parseInt(key);
  if (isNaN(int)) throw new Error('redux-persist-migrate: migrations must be keyed with integer values');
  return int;
};

function createMigration(manifest, versionSelector, versionSetter) {
  if (typeof versionSelector === 'string') {
    var reducerKey = versionSelector;
    versionSelector = function versionSelector(state) {
      return state && state[reducerKey] && state[reducerKey].version;
    };
    versionSetter = function versionSetter(state, version) {
      if (['undefined', 'object'].indexOf(_typeof(state[reducerKey])) === -1) {
        console.error('redux-persist-migrate: state for versionSetter key must be an object or undefined');
        return state;
      }
      state[reducerKey] = state[reducerKey] || {};
      state[reducerKey].version = version;
      return state;
    };
  }

  var versionKeys = Object.keys(manifest).map(processKey).sort(function (a, b) {
    return a - b;
  });
  var currentVersion = versionKeys[versionKeys.length - 1];
  if (!currentVersion && currentVersion !== 0) currentVersion = -1;

  var migrationDispatch = function migrationDispatch(next) {
    return function (action) {
      if (action.type === _constants.REHYDRATE) {
        var incomingState = action.payload;
        var incomingVersion = parseInt(versionSelector(incomingState));
        if (isNaN(incomingVersion)) incomingVersion = null;

        if (incomingVersion !== currentVersion) {
          var migratedState = migrate(incomingState, incomingVersion);
          action.payload = migratedState;
        }
      }
      return next(action);
    };
  };

  var migrate = function migrate(state, version) {
    // if (version != null) {
    //   versionKeys.filter(function (v) {
    //     return v > version;
    //   }).forEach(function (v) {
    //     state = manifest[v](state);
    //   });
    // }
    versionKeys
       .filter((v) => v > version || version === null)
       .forEach((v) => { state = manifest[v](state) });
       
    state = versionSetter(state, currentVersion);
    return state;
  };

  return function (next) {
    return function (reducer, initialState, enhancer) {
      var store = next(reducer, initialState, enhancer);
      return _extends({}, store, {
        dispatch: migrationDispatch(store.dispatch)
      });
    };
  };
}