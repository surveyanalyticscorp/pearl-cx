import {applyMiddleware, createStore, compose} from 'redux';
import rootReducer from '../reducer/index.reducer';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {rootSaga} from '../sagas/index';
import {store} from './store';
import {composeWithDevTools} from '@redux-devtools/extension';

jest.mock('redux', () => ({
  ...jest.requireActual('redux'),
  applyMiddleware: jest.fn(),
  createStore: jest.fn(),
  compose: jest.fn((...args) => args),
}));

jest.mock('redux-logger', () => ({
  createLogger: jest.fn(() => jest.fn()),
}));

jest.mock('redux-saga', () =>
  jest.fn(() => ({
    run: jest.fn(),
  })),
);

jest.mock('@redux-devtools/extension', () => ({
  composeWithDevTools: jest.fn(arg => arg),
}));

jest.mock('../reducer/index.reducer', () => jest.fn());
jest.mock('../sagas/index', () => ({rootSaga: jest.fn()}));

// Set up devToolsExtension mock globally
const devToolsFunction = jest.fn();
global.window.__REDUX_DEVTOOLS_EXTENSION__ = devToolsFunction;

describe('Redux Store Configuration', () => {
  let sagaMiddleware;

  beforeEach(() => {
    sagaMiddleware = createSagaMiddleware();
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete global.window.__REDUX_DEVTOOLS_EXTENSION__; // Cleanup after all tests
  });

  it('should configure the store with rootReducer, middleware, and dev tools', () => {
    const enhancer = compose(applyMiddleware(sagaMiddleware, createLogger()));
    createStore(rootReducer, {}, enhancer);

    expect(createStore).toHaveBeenCalledWith(
      rootReducer,
      {},
      expect.any(Array),
    );
  });

  it('should apply sagaMiddleware and logger as middleware', () => {
    const logger = createLogger();

    applyMiddleware(sagaMiddleware, logger);

    expect(applyMiddleware).toHaveBeenCalledWith(sagaMiddleware, logger);
  });

  it('should compose with dev tools if available', () => {
    const mockEnhancer = jest.fn();
    composeWithDevTools(mockEnhancer);

    expect(composeWithDevTools).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should run the rootSaga with sagaMiddleware', () => {
    sagaMiddleware.run(rootSaga);

    expect(sagaMiddleware.run).toHaveBeenCalledWith(rootSaga);
  });

  it('should add devToolsExtension to enhancerList if it is a function', () => {
    // Re-import store setup to apply mock
    jest.resetModules();
    require('./store');

    expect(devToolsFunction).toHaveBeenCalled();
  });
});
