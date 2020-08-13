import {applyMiddleware, createStore} from 'redux';
import rootReducer from '../reducer/index.reducer';
import {createLogger} from 'redux-logger';

import createSagaMiddleware from 'redux-saga';
import {rootSaga} from '../sagas/index';

const sagaMiddleware = createSagaMiddleware();

// Redux: Store
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware, createLogger()),
);

// Middleware: Redux Saga
sagaMiddleware.run(rootSaga);

module.exports = {
  store,
};
