import {
  StyleSheet,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'column',
  },
  rowContainer: {
    marginBottom: 10,
    backgroundColor: 'rgba(205, 205, 205, 0.2)'
  },
  surveyContainer: {
    marginVertical: 4,
    paddingHorizontal: 4
  },
  queryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  query: {
    width: width - 150,
    paddingRight: 20
  },
  progressContainer: {
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'flex-end'
  },
  textBold: {
    fontWeight: 'bold'
  },
  textMedium: {
    fontSize: 12
  },
  textLarge: {
    fontSize: 14
  },
  grayText: {
    color: '#9B9B9B'
  },
  whiteText: {
    color: 'white'
  },
  updateButtonWrapper: {
    borderTopWidth: 1,
    borderTopColor: 'grey', 
    flex: 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#D8D8D8'
  },
  updateButton: {
    width: width - 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(37, 137, 228)'
  }
});

export default styles;
