import React from 'react';

import {
  createSwitchNavigator,
  createAppContainer,
  StackActions,
} from 'react-navigation';

import SplashScreen from '../login/SplashScreen';
import SignInScreen from '../login/SignIn';
import CompanyCode from '../login/CompanyCode';
import MarketingScreen from '../login/MarketingScreen';

import {createStackNavigator} from '@react-navigation/stack';

const RootStack = createStackNavigator();

const SignInStackScreen = ({navigation}) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="MarketingScreen" component={MarketingScreen} />
    <RootStack.Screen name="CompanyCodeScreen" component={CompanyCode} />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
  </RootStack.Navigator>
);

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: SignInStackScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(AppNavigator);
