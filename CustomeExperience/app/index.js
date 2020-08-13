import React from 'react';
import {store} from './redux/store/store';
import {Provider} from 'react-redux';
import {AppearanceProvider} from 'react-native-appearance';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from './components/login/SplashScreen';

const CxApp = () => {
  let ref = React.forwardRef();
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <SplashScreen />
        <FlashMessage position="top" ref={ref} />
      </AppearanceProvider>
    </Provider>
  );
};

export default CxApp;
