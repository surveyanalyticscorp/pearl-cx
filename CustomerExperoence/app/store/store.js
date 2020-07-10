import {applyMiddleware, compose, createStore} from 'redux';
import {createReactNavigationReduxMiddleware} from 'react-navigation-redux-helpers';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducer/index.reducer';
import {apiMiddleware} from 'redux-api-middleware';

const enhancerList = [];
const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

if (typeof devToolsExtension === 'function') {
  enhancerList.push(devToolsExtension());
}

const typeResolvers = {};
let currentStore;
const dispatchProcessMiddleware = store => {
  currentStore = store;
  return next => action => {
    const resolvers = typeResolvers[action.type];
    if (resolvers && resolvers.length > 0) {
      resolvers.forEach(resolve => resolve());
    }
    next(action);
  };
};

export async function dispatchProcess(
  requestAction,
  successActionType,
  failureActionType = undefined,
) {
  if (!currentStore) {
    throw new Error('dispatchProcess middleware must be registered');
  }

  if (!successActionType) {
    throw new Error('At least one action to resolve process is required');
  }

  const promise = new Promise((resolve, reject) => {
    typeResolvers[successActionType] = typeResolvers[successActionType] || [];
    typeResolvers[successActionType].push(resolve);
    if (failureActionType) {
      typeResolvers[failureActionType] = typeResolvers[failureActionType] || [];
      typeResolvers[failureActionType].push(reject);
    }
  });

  currentStore.dispatch(requestAction);

  return promise;
}

const NavMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const composedEnhancer = compose(
  applyMiddleware(
    apiMiddleware,
    dispatchProcessMiddleware,
    NavMiddleware,
    ReduxThunk,
  ),
  ...enhancerList,
);

const initStore = () => createStore(rootReducer, {}, composedEnhancer);

module.exports = {
  initStore,
};
