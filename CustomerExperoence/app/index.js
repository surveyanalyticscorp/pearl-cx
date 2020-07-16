import React from 'react';

import {store} from './store/store';
import {Provider} from 'react-redux';

import {AppearanceProvider} from 'react-native-appearance';
import AppNavigator from './routes/index.router';

const CxApp = () => {
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <AppNavigator />
      </AppearanceProvider>
    </Provider>
  );
};

export default CxApp;
