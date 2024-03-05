import {applyMiddleware, createStore, compose} from 'redux';
import rootReducer from '../reducer/index.reducer';
import {createLogger} from 'redux-logger';

import createSagaMiddleware from 'redux-saga';
import {rootSaga} from '../sagas/index';
import {composeWithDevTools} from '@redux-devtools/extension';

const enhancerList = [];
const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;
if (typeof devToolsExtension === 'function') {
  enhancerList.push(devToolsExtension());
}

const sagaMiddleware = createSagaMiddleware();
const composedEnhancer = compose(
  applyMiddleware(sagaMiddleware, createLogger()),
  ...enhancerList,
);

// Redux: Store
const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(composedEnhancer),
);

// Middleware: Redux Saga
sagaMiddleware.run(rootSaga);

module.exports = {
  store,
};
