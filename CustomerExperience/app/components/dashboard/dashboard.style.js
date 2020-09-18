import {StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1
  },
  chartContainer: {
    paddingRight: PaddingConstants.tab1,
    backgroundColor: Colors.white,
    height: MarginConstants.tab4 * 5,
    marginHorizontal: MarginConstants.tab2,
    flexDirection: 'row'
  },
  imageBackgroundContainer: {
    flex: 1,
    justifyContent: 'center',
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
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.donutPercentText,
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
  // ticketText: {
  //   color: Colors.white,
  //   fontFamily: FontFamily.regular,
  //   fontSize: TextSizes.largeText,
  // },
  listViewContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.tab2,
    marginBottom: MarginConstants.tab2
  },
  productHeaderView:{
    height: MarginConstants.tab4 * 1.3,
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: PaddingConstants.tab2,
    marginVertical: PaddingConstants.tab2,
    backgroundColor: Colors.darkerGrey,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
  },
  list:{
    marginHorizontal: MarginConstants.tab1
  },
  listTitle: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.secondary,
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
    color: Colors.secondary,
    fontFamily: FontFamily.regular ,
    fontSize: TextSizes.largeText
  },

  dashboardTitle: {
    color: Colors.primary,
    fontFamily: FontFamily.medium ,
    fontSize: TextSizes.largeText,
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
    height: 3*MarginConstants.tab4,
    justifyContent: 'center',
  },
  ticketText: {
    color: Colors.accent,
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.primary,
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
    paddingLeft: PaddingConstants.tab1,
    color: Colors.primary,
    fontFamily: FontFamily.light
  },
  npsText: {
    position: 'absolute',
    top: '50%',
    left:'15%',
    color: Colors.primary,
    fontSize: TextSizes.extraLargeText,
    fontFamily: FontFamily.semiBold
  },
  donutInfoContainer: {
    flex:1,
    marginVertical: MarginConstants.tab1
  }
});
