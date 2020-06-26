import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flex: 0.10,
    borderBottomWidth: 1,
    justifyContent: 'center',
    borderBottomColor: 'transparent'
  },
  title: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headingTxt: {
    fontSize: 14,
    color: '#888'
  },
  status: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dataContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  popoverContainer: {
    paddingHorizontal: 12
  },
  background: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  popoverContent: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: '#979797',
    backgroundColor: '#FFFFFF'
  },
  textContainer: {
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  green: {
    color: '#689138'
  },
  red: {
    color: '#D0021B'
  },
  levelContainer: {
    paddingVertical: 4,
    flexDirection: 'row'
  }
});

export default styles;
