import {StyleSheet} from 'react-native';
import {Colors} from './color.constants';

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
  androidButtonText: {
    color: 'blue',
    fontSize: 20,
  },
});

export const MyTheme = {
  dark: false,
  colors: {
    primary: 'white',
    background: 'white',
    card: Colors.accent,
    text: 'white',
    border: 'green',
  },
};
