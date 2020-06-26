import { StyleSheet, Dimensions,Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

module.exports = StyleSheet.create({
  container: {
    flex: 0.9,
    padding: 5,
    flexDirection: 'column'
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 0.9
  },
  item: {
    flex: 1,
    flexDirection: 'row'
  },
  categoryTxt: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgb(103, 106, 113)'
  },
  reviewCategoryLayout: {
    marginTop: 10,
    width: width - 20,
    flexDirection: 'row'
  },
  reivewCategoryItem: {
    flex: 1,
    padding: 2,
    marginRight: 10,
    borderColor: '#f00',
    alignItems: 'center',
    borderBottomWidth: 2,
    justifyContent: 'center',
      ...Platform.select({
          android: { borderWidth: 0.5 },
          ios: { borderWidth: 1 }
      })
  },
  categoryItemTxt: {
    fontSize: 11,
    color: '#f00'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  commentBox: {
    flex: 1,
    padding: 4,
    height: 30,
    width: null,
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff'
  },
  commentBoxAndroid: {
    flex: 1,
    padding: 4,
    height: 30,
    width: width - 30,
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff'
  },
  button: {
    flex: 0,
    height: 37,
    padding: 20,
    width: width - 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(37, 137, 228)'
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: 'bold'
  },
  divider: {
    flex: 0.1,
    backgroundColor: '#fff'
  },
  resetBoxWrapper: {
    marginLeft: 10,
    position: 'absolute',
    left: width,
    bottom: 0,
    width: width / 4,
    backgroundColor: 'rgb(248, 248, 248)'
  },
  resetBoxContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBoxWrapperAndroid: {
    right: 0,
    bottom: 0,
    width: width / 3,
    position: 'absolute',
    backgroundColor: '#fff'
  },
  resetBoxContainerAndroid: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    width: width / 3 - 10,
    justifyContent: 'center',
    backgroundColor: 'rgb(248, 248, 248)'
  },
  resetTxt: {
    color: '#1B87E6'
  },
  overlay: {
    width,
    height,
    top: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },

  overlayTxt: {
    padding: 5,
    fontWeight: 'bold',
    marginLeft: width / 2 - 80,
    marginTop: height / 2 - 100
  },

  reviewSubmitted: {
    flex: 0,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8D8D8'
  },
  reviewSubmittedTxt: {
    color: '#545E6B'
  },
  buttonContainer: {
    flex: 0,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8D8D8'
  }
});
