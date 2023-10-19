import {StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import DeviceInfo from 'react-native-device-info';

export const dashboardStyles = StyleSheet.create({
  highchart: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
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
    color: Colors.filterIconColor,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.secondary,
    textAlign: 'center',
  },
  response: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.light,
    textAlign: 'center',
    paddingHorizontal: PaddingConstants.tab1,
  },
  ticketButton: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.lightBlack,
    marginVertical: MarginConstants.tab4,
    paddingVertical: PaddingConstants.tab2,
  },
  listViewContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.tab2,
    //marginBottom: MarginConstants.tab2
  },
  productHeaderView: {
    height: MarginConstants.tab4 * 1.3,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab2,
    marginTop: MarginConstants.tab2,
    marginBottom: MarginConstants.tab1,
    backgroundColor: Colors.darkerGrey,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
  },
  list: {
    marginHorizontal: MarginConstants.tab1,
    marginBottom: MarginConstants.tab2,
  },
  listTitle: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.primary,
  },
  responseView: {
    justifyContent: 'center',
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
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },

  dashboardTitle: {
    // color: Colors.primary,
    color: Colors.white,
    backgroundColor: Colors.accent,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },

  dashboardTitleContainer: {
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,

    backgroundColor: Colors.accent,
    marginTop: MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab2,
    paddingVertical: PaddingConstants.tab1,
    paddingHorizontal: MarginConstants.tab2,
  },
  closedLoopView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: MarginConstants.tab2,
    marginBottom: MarginConstants.tab2,
  },
  ticketContainer: {
    flex: 3,
    backgroundColor: Colors.white,
    height: 4 * MarginConstants.tab4,
    justifyContent: 'center',
  },
  ticketText: {
    color: Colors.accent,
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.largeText,
    marginBottom: 5,
    textAlign: 'center',
  },
  separator: {
    marginHorizontal: MarginConstants.tab2,
    marginVertical: MarginConstants.halfTab,
    height: 0.5,
    backgroundColor: Colors.borderColor,
  },
  emptySeparator: {
    marginHorizontal: MarginConstants.tab2,
    marginVertical: MarginConstants.tab1,
    height: 0.5,
    backgroundColor: Colors.fullTransparent,
  },
  ticketTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: MarginConstants.tab1,
    marginBottom: MarginConstants.tab2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketType: {
    paddingLeft: PaddingConstants.halfTab,
    color: Colors.primary,
    fontFamily: FontFamily.light,
    fontSize: TextSizes.secondary,
  },
  npsView: {
    position: 'absolute',
    left: '10%',
    top: DeviceInfo.isTablet() ? '20%' : '25%',
    width: 5 * MarginConstants.tab4,

    paddingHorizontal: PaddingConstants.halfTab,
  },
  npsPercentText: {
    color: Colors.primary,
    fontSize: TextSizes.donutPercentText,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  npsText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
  },
  detailsText: {
    color: Colors.black,
    fontSize: TextSizes.semiSecondary,
    fontFamily: FontFamily.regular,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: Colors.white,
    height: DeviceInfo.isTablet()
      ? MarginConstants.tab4 * 9
      : MarginConstants.tab4 * 7,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginHorizontal: MarginConstants.tab2,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
  },
  donut: {
    marginTop: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab2,
  },
  donutInfoContainer: {
    marginVertical: MarginConstants.tab1,
  },
  row: {
    height: 1.2 * PaddingConstants.tab4,
    paddingHorizontal: PaddingConstants.tab2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: MarginConstants.tab1,
  },
  productText: {
    color: Colors.primary,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
  },
  filterView: {
    marginTop: MarginConstants.tab1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    flexDirection: 'row',
  },
  filterText: {
    color: Colors.accent,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    textAlign: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
  },
});
