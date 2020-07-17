import React from 'react';

import {store} from './store/store';
import {Provider} from 'react-redux';

import {AppearanceProvider} from 'react-native-appearance';
import AppNavigator from './routes/index.router';
import SplashScreen from './login/SplashScreen';

const CxApp = () => {
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <SplashScreen />
      </AppearanceProvider>
    </Provider>
  );
};

export default CxApp;
