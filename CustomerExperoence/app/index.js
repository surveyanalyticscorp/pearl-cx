import React from 'react';

import {initStore} from './store/store';
import {Provider} from 'react-redux';

import {AppearanceProvider} from 'react-native-appearance';
import SplashScreen from './login/SplashScreen';
const store = initStore();

const CxApp: () => React$Node = () => {
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <SplashScreen />
      </AppearanceProvider>
    </Provider>
  );
};

export default CxApp;
