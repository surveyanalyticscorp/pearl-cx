import React, {Component} from 'react';

import {initStore} from './store/store';
import {Provider} from 'react-redux';
import {View, TouchableOpacity, Text} from 'react-native';

import {
  useColorScheme,
  AppearanceProvider,
} from 'react-native-appearance';
import {
  NavigationContainer,
  DarkTheme,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import NavigationDrawer from './routes/drawer.router';
import AppNavigator from './routes/index.router';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const HeaderLeft = () => {
    const navigation = useNavigation();
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}>
          <Icon name="menu" size={35} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const Stack = createStackNavigator();
  //const App1 = reduxifyNavigator(AppNavigator, 'root');

  return (
    <Provider store={store}>
      <AppearanceProvider>
        <NavigationContainer
          theme={colorScheme == 'dark' ? DarkTheme : MyTheme}>
          <Stack.Navigator>
            <Stack.Screen
              options={{
                headerLeft: ({}) => <HeaderLeft />,
              }}
              component={NavigationDrawer}
              name="Drawer"
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppearanceProvider>
    </Provider>
  );
};

export default CxApp;
