import React from 'react';

import {initStore} from './store/store';
import {Provider} from 'react-redux';

import {AppearanceProvider} from 'react-native-appearance';
import AppNavigator from './routes/index.router';

import SplashScreen from './login/SplashScreen';
const store = initStore();

const CxApp: () => React$Node = () => {
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <AppNavigator />
      </AppearanceProvider>
    </Provider>
  );
};

export default CxApp;
