import { StyleSheet, Dimensions, Platform } from 'react-native';

import { responsiveFontSize } from '../../../common/font';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
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
  header: {
    flex: 0.10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent'
  },
  headerText: {
    fontSize: 12,
    color: '#545E6B'
  },
  content: {
    flex: 0.9,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  item: {
    height: 30,
    margin: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: '#1B87E6',
    width: width / 2 - 50,
    justifyContent: 'center'
  },
  itemSelected: {
    height: 30,
    margin: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: 'center',
    width: width / 2 - 50,
    justifyContent: 'center',
    borderColor: 'transparent',
    backgroundColor: '#4A90E2'
  },
  categoryTxt: {
    color: '#1B87E6',
    fontSize: responsiveFontSize()
  },
  categoryTxtSelected: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize()
  },
  loadMoreItems: {
    flex: 0,
    height: 30,
    marginBottom: 5
  }
});

export default styles;
