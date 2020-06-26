import { Platform, Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#979797',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    paddingHorizontal: 8,
    height: 50,
    fontSize: 12,
    width: Dimensions.get('window').width - 100,
  }
});

export default styles;
