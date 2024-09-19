import React from 'react';
import {Keyboard, Pressable} from 'react-native';

const DismissKeyboard = ({children}) => (
  <Pressable accessibilityRole={'button'} onPress={() => Keyboard.dismiss()}>
    {children}
  </Pressable>
);

export default DismissKeyboard;
