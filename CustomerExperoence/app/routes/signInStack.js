import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../login/SignIn';
import CompanyCode from '../login/CompanyCode';
import ForgotPassword from '../login/ForgotPassword';
import MarketingScreen from '../login/MarketingScreen';
const RootStack = createStackNavigator();

const SignInStack = ({navigation}) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="MarketingScreen"
      component={MarketingScreen}
      options={{title: 'My home'}}
    />
    <RootStack.Screen
      name="CompanyCode"
      component={CompanyCode}
      options={{title: 'My home'}}
    />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
  </RootStack.Navigator>
);

export default SignInStack;
