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

import Screen1 from '../drawerTabs/Screen1';
import Screen2 from '../drawerTabs/Screen2';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Colors} from '../styles/color.constants';

const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDefaultTheme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    background: '#ffffff',
    text: '#333333',
  },
};

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    background: '#333333',
    text: '#ffffff',
  },
};

const navigationDrawer = ({navigation}) => (
  <Drawer.Navigator
    drawerStyle={{
      backgroundColor: Colors.white,
    }}
    drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Screen name="Feedback" component={Screen1} />
    <Drawer.Screen name="Dashboard" component={Screen2} />
  </Drawer.Navigator>
);

CompanyCode.navigationOptions = ({navigation}) => ({
  headerLeft: (
    <HeaderBackButton
      onPress={() => {
        navigation.navigate('Home');
      }}
    />
  ),
});

const navigationOptions = ({navigation}) => ({
  headerLeft: (
    <HeaderBackButton
      onPress={() => {
        navigation.navigate('Home');
      }}
    />
  ),
});

const SignInStackScreen = ({navigation}) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="MarketingScreen" component={MarketingScreen} />
    <RootStack.Screen name="CompanyCodeScreen" component={CompanyCode} navigationOptions/>
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
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
