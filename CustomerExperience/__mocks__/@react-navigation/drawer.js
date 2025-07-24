// __mocks__/@react-navigation/drawer.js

module.exports = {
  createDrawerNavigator: jest.fn(() => ({
    Navigator: jest.fn(({children}) => <>{children}</>),
    Screen: jest.fn(({children}) => <>{children}</>),
  })),
  useDrawerStatus: jest.fn(() => 'closed'), // Default to 'closed'
  useDrawerProgress: jest.fn(() => ({
    current: {
      progress: 0,
    },
  })),
  DrawerLayout: jest.fn(({children, renderNavigationView}) => (
    <>
      <View testID="drawer-content">{children}</View>
      <View testID="drawer-navigation">{renderNavigationView()}</View>
    </>
  )),
};

import React from 'react';
import {View} from 'react-native';
