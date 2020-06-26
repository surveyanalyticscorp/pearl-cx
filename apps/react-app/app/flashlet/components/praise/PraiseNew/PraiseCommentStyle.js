import { StyleSheet } from 'react-native';
import {
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  container: {
    padding: 4,
    height: 108,
    borderWidth: 2,
    borderRadius: 8,
    shadowOpacity: 0.3,
    borderColor: 'grey',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: height / 3,
    backgroundColor: 'white'
  },
  input: {
    height: 60,
    padding: 8,
    fontSize: 12,
    width: width - 36,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  errorMsg: {
    color: 'red',
    marginVertical: 10
  },
  doneButton: {
    padding: 4,
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 4,
    width: width - 104,
    borderColor: 'grey',
    alignItems: 'center'
  }
});

export default styles;
