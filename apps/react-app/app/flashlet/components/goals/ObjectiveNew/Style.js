import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F5F5F5'
  },
  inputContainer: {
    flex: 0.9
  },
  input: {
    padding: 8,
    fontSize: 12,
    height: height,
    width: width - 20,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top'
  },
  buttonContainer: {
    flex: 0,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    flex: 0,
    height: 37,
    padding: 20,
    width: width - 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(37, 137, 228)'
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default styles;
