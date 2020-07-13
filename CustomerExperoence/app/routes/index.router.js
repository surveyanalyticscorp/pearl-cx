import React from 'react';

import {
  createSwitchNavigator,
  createAppContainer,
  StackActions,
} from 'react-navigation';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

import SplashScreen from '../login/SplashScreen';
import SignInScreen from '../login/SignIn';
import CompanyCode from '../login/CompanyCode';
import MarketingScreen from '../login/MarketingScreen';
import ForgotPassword from '../login/ForgotPassword';
import HeaderBackButton from '../widgets/HeaderBackButton';
import {DrawerContent} from './DrawerContent';

import FeedbackAll from '../drawerTabs/FeedbackAll';
import FeedbackDetractor from '../drawerTabs/FeedbackDetractor';
import Screen2 from '../drawerTabs/Screen2';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Colors} from '../styles/color.constants';

const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();

const createFeedbackTopTabs = props => {
  return (
    <MaterialTopTabs.Navigator
      tabBarOptions={{
        indicatorStyle: {backgroundColor: '#FF0000'},
        scrollEnabled: true,
        labelStyle: {color: '#000000', fontSize: 12},
        tabStyle: {width: 150},
        style: {backgroundColor: '#FFFFFF'},
      }}>
      <MaterialTopTabs.Screen name="All" component={FeedbackAll} />
      <MaterialTopTabs.Screen name="Detractor" component={FeedbackDetractor} />
      <MaterialTopTabs.Screen name="Passive" component={FeedbackAll} />
      <MaterialTopTabs.Screen name="Promoter" component={FeedbackDetractor} />
    </MaterialTopTabs.Navigator>
  );
};

const NavigationDrawer = ({navigation}) => (
  <Drawer.Navigator
    drawerStyle={{
      backgroundColor: Colors.white,
    }}
    drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Screen name="Feedback" children={createFeedbackTopTabs} />
    <Drawer.Screen name="Dashboard" component={Screen2} />
  </Drawer.Navigator>
);

const SignInStackScreen = props => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="CompanyCodeScreen"
      component={CompanyCode}
      options={{title: 'My home'}}
    />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
  </RootStack.Navigator>
);

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: NavigationDrawer,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(AppNavigator);
