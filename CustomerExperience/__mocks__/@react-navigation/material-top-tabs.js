// __mocks__/@react-navigation/material-top-tabs.js
import React from 'react';
import {View} from 'react-native';
export const createMaterialTopTabNavigator = jest.fn(() => ({
  Navigator: ({children, ...props}) => (
    <View testID="tab-navigator" {...props}>
      {children}
    </View>
  ),
  Screen_: ({name, component, ...props}) => (
    <View testID={`tab-screen-${name}`} {...props}>
      {React.createElement(component, props)}
    </View>
  ),
  Screen: ({name, component, initialParams, ...props}) => (
    <View testID={`tab-screen-${name}`} {...props}>
      {React.createElement(component, {
        name,
        route: {params: initialParams},
        navigation: {
          setOptions: jest.fn(),
        },
      })}
    </View>
  ),
}));
