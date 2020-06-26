import { StyleSheet, Platform } from 'react-native';

import { responsiveFontSize } from '../../../common/font';

module.exports = StyleSheet.create({
  /* ........Review Drag Items style .........*/
  container: {
    flex: 0.9,
    paddingLeft: 5,
    paddingRight: 2,
    paddingVertical: 5
  },
  header: {
    flex: 0.1,
    flexDirection: 'row'
  },
  heading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headingTxt: {
    fontSize: 14,
    color: '#888'
  },
  status: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 0.9,
    flexDirection: 'row'
  },
  itemWrapper: {
    flex: 0.67,
    marginTop: 50,
    marginBottom: 50
  },
  item: {
    padding: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  scrollItems: {
    flex: 0.7
  },
  dropZoneArea: {
    flex: 0.33,
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  itemTItle: {
    flex: 0,
    padding: 5
  },
  itemTItleSelected: {
    flex: 0,
    padding: 5,
    shadowRadius: 2,
    shadowOpacity: 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }
  },
  titleTxt: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'rgb(162, 210, 262)',
    textDecorationLine: 'underline'
  },
  titleTxtSelected: {
    fontSize: 11,
    opacity: 0.7,
    fontWeight: 'bold',
    color: 'rgb(162, 210, 262)',
    textDecorationLine: 'underline'
  },
  boxLayout: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxHoverLayout: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxOne: {
    backgroundColor: '#C43434'
  },
  boxOneDragOver: {
    backgroundColor: 'rgba(196,52, 52, 0.3)'
  },
  boxTwo: {
    backgroundColor: '#F7B850'
  },
  boxTwoDragOver: {
    backgroundColor: 'rgba(248, 183, 89, 0.3)'
  },
  boxThree: {
    backgroundColor: '#7ED321'
  },
  boxThreeDragOver: {
    backgroundColor: 'rgba(152, 219, 77, 0.3)'
  },
  boxFour: {
    backgroundColor: '#658C36'
  },
  boxFourDragOver: {
    backgroundColor: 'rgba(105, 145, 56, 0.3)'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dragItems: {
    color: '#fff',
    fontSize: responsiveFontSize(2)
  },
  dropZoneTop: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropZoneTopTxt: {
    fontSize: responsiveFontSize(2)
  },
  dropZoneBottom: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropZoneBottomTxt: {
    fontSize: responsiveFontSize(2)
  },
  resetBtn: {
    flex: 0.3,
    paddingRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  resetBtnImg: {
    width: 22,
    height: 22
  },
  dropZoneBoxes: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  dragItemsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
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
  /* ........End .........*/
  /* ........Review Drag Holder style .........*/
  dragOnReady: {
    height: 26,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#D8D8D8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dragOnHold: {
    height: 26,
    borderWidth: 0,
    borderColor: '#fff'
  },
  dragShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    opacity: 1,
    marginTop: 65,
    alignItems: 'center',
    height: 26,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#D8D8D8'
  },
  /* ........ END .........*/
  /* ........Review Drop Holder style .........*/

  dropItemTitle: {
    fontSize: 12,
    color: '#fff',
    marginRight: 2,
    fontWeight: 'bold',
    flex: 0,
    flexWrap: 'wrap'
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  boxOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    marginTop: -5,
    marginRight: -5
  },
  boxWrapper: {
    padding: 5
  },
  center: {
    flex: 1
  },
  bottomContainerLight: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.63)'
  },
  bottomContainerDark: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.88)'
  }
});
