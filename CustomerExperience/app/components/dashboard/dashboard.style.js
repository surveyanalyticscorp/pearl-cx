import {StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {fontFamily} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cxContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  center: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
  chartContainer: {
    padding: MarginConstants.tab1,
    backgroundColor: Colors.white,
    height: MarginConstants.tab4 * 5,
    justifyContent: 'center',
  },
  imageBackgroundContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  gauge: {
    position: 'absolute',
    width: 100,
    height: MarginConstants.tab3 * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    left: MarginConstants.tab3,
    top: MarginConstants.tab4 * 1.5,
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: textColors.accent,
    fontFamily: fontFamily.SemiBold,
    fontSize: TextSizes.donutPercentText,
  },
  npmGaugeText: {
    backgroundColor: 'transparent',
    color: textColors.accent,
    fontFamily: fontFamily.Light,
    fontSize: TextSizes.secondary,
  },
  responseText: {
    color: '#00508E',
    fontFamily: fontFamily.Bold,
    fontSize: 30,
  },
  response: {
    color: '#00508E',
    fontFamily: fontFamily.Light,
    fontSize: TextSizes.largeText,
  },
  ticketButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#404A5B',
    marginVertical: MarginConstants.tab4,
    paddingVertical: PaddingConstants.tab2,
  },
  ticketText: {
    color: 'white',
    fontFamily: fontFamily.Regular,
    fontSize: TextSizes.largeText,
  },
  listViewContainer: {
    backgroundColor: 'white',
    height: MarginConstants.tab4 * 5,
  },
  textView:{
    height: MarginConstants.tab4 * 1.5,
    justifyContent: 'center',
    paddingLeft: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.tab2,
    backgroundColor: Colors.grey,
  },
  listTitle: {
    color: textColors.accent,
    fontFamily: fontFamily.Regular,
    fontSize: TextSizes.secondary,
  },
  responseView: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.black,
    fontSize: 16
  },
  emptyView: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  detractorEmptyText: {
    color: Colors.white,
    fontFamily: fontFamily.Bold ,
    fontSize: TextSizes.largeText
  },
  detractorView: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});
