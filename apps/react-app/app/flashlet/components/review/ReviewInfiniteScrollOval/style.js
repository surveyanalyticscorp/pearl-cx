import { StyleSheet } from 'react-native';

import { responsiveFontSize } from '../../../common/font';

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    paddingLeft: 5,
    paddingRight: 2,
    paddingBottom: 5
  },
  viewContainer: {
    flex: 1,
    paddingTop: 40,
    marginRight: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  cell: {
    margin: 8,
    height: 26,
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: responsiveFontSize(2)
  },
  underLine: {
    height: 1
  },
  bottomContainerLight: {
    left: 0,
    right: 0,
    height: 40,
    bottom: 92,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.63)'
  },
  bottomContainerDark: {
    left: 0,
    right: 0,
    height: 40,
    bottom: 52,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.88)'
  },
  bottomContainerFixed: {
    height: 52,
    backgroundColor: 'white'
  },
  centering: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadMoreItems: {
    flex: 0,
    height: 30,
    marginBottom: 5
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles;
