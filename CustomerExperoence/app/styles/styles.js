import {StyleSheet} from 'react-native';
import {Colors} from './color.constants';
import {TextSizes} from './textsize.constants';
import {MarginConstants} from './margin.constants';

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
  errorMessageContainer: {
    flex: 1,
  },
  errorMessage: {
    fontSize: TextSizes.primary,
    margin: MarginConstants.tab2,
    color: 'red',
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
