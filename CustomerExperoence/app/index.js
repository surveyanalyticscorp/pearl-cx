import React, {Component} from 'react';

import {initStore} from './store/store';
import {Provider} from 'react-redux';
import {View} from 'react-native';
import {reduxifyNavigator} from 'react-navigation-redux-helpers';
import {
  Appearance,
  useColorScheme,
  AppearanceProvider,
} from 'react-native-appearance';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';

import AppNavigator from './routes/index.router';

const store = initStore();

const CxApp: () => React$Node = () => {
  const colorScheme = useColorScheme();

  const MyTheme = {
    dark: false,
    colors: {
      primary: 'white',
      background: 'white',
      card: '#65509f',
      text: 'white',
      border: 'green',
    },
  };

  //const App1 = reduxifyNavigator(AppNavigator, 'root');

  return (
    <Provider store={store}>
      <AppearanceProvider>
        <NavigationContainer
          theme={colorScheme == 'dark' ? DarkTheme : MyTheme}>
          <View style={{flex: 1}}>
            <AppNavigator />
          </View>
        </NavigationContainer>
      </AppearanceProvider>
    </Provider>
  );
};

export default CxApp;
