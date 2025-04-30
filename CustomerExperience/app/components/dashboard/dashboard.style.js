import {StyleSheet, Platform} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import DeviceInfo from 'react-native-device-info';
import {baseTextStyles, textStyles} from '../../styles/text.styles';
import {buttonStyles} from '../../styles/button.styles';

export const dashboardStyles = StyleSheet.create({
  highchart: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  containerIOS: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? MarginConstants.tab4 : 0,
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
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._500,
    fontSize: TextSizes.primary,
    textAlign: 'center',
  },
  response: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    fontWeight: FontWeight._300,
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
    marginBottom: MarginConstants.tab1,
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
    color: Colors.accent,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight._500,
    fontSize: TextSizes.primary,
  },

  dashboardTitleContainer: {
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: MarginConstants.tab2,
    paddingVertical: PaddingConstants.tab1,
    maxHeight: MarginConstants.tab4 * 1.5,
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
    marginVertical: MarginConstants.halfTab,

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
      ? MarginConstants.tab4 * 13
      : MarginConstants.tab4 * 11,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab2,
    borderRadius: 5,
  },
  csatChartContainer: {
    backgroundColor: Colors.white,
    height: DeviceInfo.isTablet()
      ? MarginConstants.tab1_4x * 14
      : MarginConstants.tab1_4x * 13,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab2,
    borderRadius: 5,
  },
  donut: {
    marginTop: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab2,
    backgroundColor: Colors.accent,
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
  squareView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: MarginConstants.halfTab,
  },
  emptyBenchmarkView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: MarginConstants.tab1_2x,
  },
  roundSquareShape: {
    borderRadius: 2,
    width: 8,
    height: 8,
    alignSelf: 'auto',
    marginHorizontal: MarginConstants.halfTab,
  },
  npsViewContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
  csatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    height: '90%',
    top: MarginConstants.tab3,
  },
  csatScoreLabel: {
    ...baseTextStyles.donutPercentRegularText,
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    top: 1.5 * MarginConstants.tab4,
    color: Colors.filterIconColor,
  },
  csatToggleButton: {
    ...buttonStyles.outlineGreyButton,
    backgroundColor: Colors.white,
    width: 3.5 * MarginConstants.tab4,
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    top: 2.8 * MarginConstants.tab4,
    zIndex: 100,
  },
  csatToggleButtonText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,
  },
  renderInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PaddingConstants.tab2,
  },
  renderNpsChartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  csatLegendContainer: {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    top:
      MarginConstants.tab1_16x +
      MarginConstants.tab1_4x +
      MarginConstants.tab1_2x,
    width: '100%',
  },

  npsLegendContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
    maxHeight: '25%',
    marginBottom: MarginConstants.tab2,
  },
  legendIcon: {
    width: MarginConstants.tab1 * 1.5,
    height: MarginConstants.tab1 * 1.5,
    borderRadius: 2,
    alignItems: 'center',
    marginEnd: MarginConstants.halfTab,
  },
  legendItemView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab2,
    paddingVertical: Platform.OS === 'ios' ? PaddingConstants.halfTab : 0,
  },

  npsIcon: {justifyContent: 'center', alignItems: 'center'},
});
