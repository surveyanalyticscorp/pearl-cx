import {StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {fontFamily} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';
export const dashboardStyles = StyleSheet.create({
  cxContainer: {
    flex: 1,
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
});
