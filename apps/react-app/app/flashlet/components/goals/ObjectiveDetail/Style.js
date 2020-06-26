import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const sliderItemWidth = width / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  goalDesc: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  content: {
    flex: 0.87,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF'
  },
  footer: {
    flex: 0.13,
    backgroundColor: '#FFFFFF'
  },
  sliderTitle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  slider: {
    paddingHorizontal: 20
  },
  sliderLabelTxtNS: {
    fontSize: 13,
    color: 'grey'
  },
  sliderLabelTxtW: {
    fontSize: 13,
    color: 'orange'
  },
  sliderLabelTxtN: {
    fontSize: 13,
    color: 'green'
  },
  sliderThumbStyle: {
    width: 10,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#cccccc'
  },
  underline: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgb(29, 119, 186)'
  },
  sliderOverlay: {
    bottom: 20,
    height: 40,
    position: 'absolute',
    width: sliderItemWidth,
    backgroundColor: 'transparent'
  },
  headerMsg: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  }
});

export default styles;
