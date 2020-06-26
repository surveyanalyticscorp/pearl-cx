import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: width - 10,
    height: height - 75,
    backgroundColor: 'rgba(152, 173, 191, 0.9)',
    borderRadius: 5,
    flex: 1
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'transparent'
  },
  textNumber: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold'
  },
  title: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  textEmployee: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  textBadgeName: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  textAward: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  badgeUser: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
    borderColor: 'rgb(247, 216, 119)'
  },
  close: {
    left: width - 42,
    top: 0
  }
});

export default styles;
