import {
  StyleSheet,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContainer: {
    flex: 0.34,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 26
  },
  topTextContainer: {
    flex: 0.7,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  topText: {
    fontSize: 18,
    color: '#545E6B',
    paddingVertical: 12,
    fontFamily: 'ProximaNova-Regular'
  },
  lightText: {
    color: '#75808F'
  },
  imageContainer: {
    flex: 0.2,
    alignItems: 'flex-end'
  },
  image: {
    width: 54,
    height: 54
  },
  middleContainer: {
    flex: 0.34,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 26,
    backgroundColor: '#F9F9F9'
  },
  middleText: {
    fontSize: 18,
    color: '#545E6B',
    paddingVertical: 12,
    fontFamily: 'ProximaNova-Regular'
  },
  bottomContainer: {
    flex: 0.14,
    paddingBottom: 32,
    flexDirection: 'row',
    paddingHorizontal: 26,
    alignItems: 'flex-end'
  },
  buttonContainer: {
    height: 36,
    borderWidth: 1,
    alignItems: 'center',
    width: width - 26 * 2,
    borderColor: '#1B87E6',
    justifyContent: 'center',
    backgroundColor: '#1B87E6'
  }
});

export default styles;
