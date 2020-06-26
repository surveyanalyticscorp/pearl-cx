import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center'
  },
  headingTxt: {
    fontSize: 14,
    color: '#545E6B',
    textAlign: 'left'
  },
  statusBar: {
    flex: 1
  },
  complete: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  completeText: {
    color: '#545E6B',
    // paddingVertical: 8
  }
});

export default styles;
