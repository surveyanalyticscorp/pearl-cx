import {StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import DeviceInfo from 'react-native-device-info';

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1
  },
  imageBackgroundContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  npmGaugeText: {
    backgroundColor: 'transparent',
    color: textColors.accent,
    fontFamily: FontFamily.light,
    fontSize: TextSizes.secondary,
  },
  responseText: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    textAlign: 'center',
  },
  response: {
    fontSize: TextSizes.secondary,
    color: Colors.secondary,
    fontFamily: FontFamily.light,
    textAlign: 'center',
    paddingHorizontal: PaddingConstants.tab1
  },
  ticketButton: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection:'row',
    backgroundColor: Colors.lightBlack,
    marginVertical: MarginConstants.tab4,
    paddingVertical: PaddingConstants.tab2,
  },
  listViewContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.tab2,
    //marginBottom: MarginConstants.tab2
  },
  productHeaderView:{
    height: MarginConstants.tab4 * 1.3,
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: PaddingConstants.tab2,
    marginTop:MarginConstants.tab2,
    marginBottom: MarginConstants.tab1,
    backgroundColor: Colors.darkerGrey,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
  },
  list:{
    marginHorizontal: MarginConstants.tab1,
    marginBottom: MarginConstants.tab2
  },
  listTitle: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.primary,
  },
  responseView: {
    justifyContent: 'center',
    paddingLeft: PaddingConstants.tab2,
    paddingVertical: PaddingConstants.halfTab
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
    color: Colors.secondary,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
  emptyView: {
    flex: 1,
    marginVertical: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detractorEmptyText: {
    color: Colors.secondary,
    fontFamily: FontFamily.regular ,
    fontSize: TextSizes.largeText
  },

  dashboardTitle: {
    color: Colors.primary,
    fontFamily: FontFamily.regular ,
    fontSize: TextSizes.largeText + 1,
    marginVertical: MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab2
  },
  closedLoopView: {
    justifyContent:'center',
    alignItems:'center',
    flexDirection: 'row',
    marginHorizontal: MarginConstants.tab2,
  },
  ticketContainer: {
    flex: 3,
    backgroundColor: Colors.white,
    height: 4*MarginConstants.tab4,
    justifyContent: 'center',
  },
  ticketText: {
    color: Colors.accent,
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.largeText,
    marginBottom:5,
    textAlign: 'center',
  },
  separator:{
    marginHorizontal: MarginConstants.tab2,
    marginVertical: MarginConstants.tab1,
    height: .5,
    backgroundColor: Colors.borderColor
  },
  ticketTypeContainer: {
    flexDirection: 'row',
    margin: MarginConstants.tab1,
    justifyContent:'center',
    alignItems:'center',
  },
  ticketType:{
    paddingLeft: PaddingConstants.halfTab,
    color: Colors.primary,
    fontFamily: FontFamily.light,
    fontSize: TextSizes.secondary,
  },
  npsView: {
    position: 'absolute',
    left: '30%',
    top: DeviceInfo.isTablet() ? '30%' : '35%',
    width: 3*MarginConstants.tab4,
    paddingHorizontal: PaddingConstants.halfTab
  },
  npsPercentText: {
    color: Colors.primary,
    fontSize: 1.2*TextSizes.donutPercentText,
    fontFamily: FontFamily.bold,
    textAlign:'center',
  },
  npsText: {
    color: Colors.primary,
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.semiBold,
    textAlign:'center',
  },
  chartContainer: {
    backgroundColor: Colors.white,
    height: DeviceInfo.isTablet() ? MarginConstants.tab4 * 6 : MarginConstants.tab4 * 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab2,
  },
  donut: {
    marginTop: MarginConstants.tab4,
    paddingHorizontal: PaddingConstants.tab2,
  },
  donutInfoContainer: {
    marginVertical: MarginConstants.tab1,
  },
  row: {
    height: 1.2*PaddingConstants.tab4,
    paddingHorizontal: PaddingConstants.tab2,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent: 'space-between',
    marginHorizontal: MarginConstants.tab1,
  },
  productText: {
    color: Colors.primary,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
  }
});
