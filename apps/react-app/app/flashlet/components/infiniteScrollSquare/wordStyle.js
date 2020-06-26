import { StyleSheet } from 'react-native';
import { responsiveFontSize } from '../../common/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  viewContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  cell: {
    padding: 10,
    marginTop: 5,
    marginBottom: 14,
    marginHorizontal: 8
  },
  text: {
    color: '#1A9BEB',
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
  }
});

export default styles;

