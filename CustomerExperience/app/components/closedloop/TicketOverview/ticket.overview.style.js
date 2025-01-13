import {StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {FontFamily, FontWeight} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';

const ticketOverviewStyles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
  container: {
    margin: MarginConstants.halfTab,
    flex: 1,
  },
  ticketStatusContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
    marginBottom: MarginConstants.halfTab,
    padding: PaddingConstants.tab1_2x,
    borderRadius: 4,
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAndDropdownContainer: {},
  titleAndUnderlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: MarginConstants.halfTab,
  },
  descriptionTextContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.halfTab,
  },
  columnContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.tab1,
  },
  headerText: {
    ...baseTextStyles.largeMediumText,
    color: Colors.accent,
  },
  modalHeader: {
    justifyContent: 'space-between',
    backgroundColor: Colors.accent,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    paddingVertical: PaddingConstants.tab1,
  },
  modalHeaderText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    color: Colors.white,
  },
  titleText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,

    alignItems: 'flex-start',
    paddingBottom: PaddingConstants.halfTab,
    flex: 2,
  },
  descriptionHeader: {
    flex: 1,
    ...baseTextStyles.largeMediumText,
  },

  subText: {
    ...baseTextStyles.secondaryLightText,
    flex: 3,
  },
  departmentNameText: {
    backgroundColor: Colors.settingsBackground,
    padding: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },

  detailsText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },

  underLineText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    textDecorationLine: 'underline',
  },

  idText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.accentLight,
  },

  ticketIdText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.accentLight,
    padding: PaddingConstants.halfTab,
  },
  viewResponseDetailsText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    textAlign: 'right',
    margin: MarginConstants.tab1,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1,
    height: '100%',
  },
  dropdownContainer: {
    flex: 2,
    flexDirection: 'row',
    height: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
  },
  dropdownInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingHorizontal: PaddingConstants.halfTab,
  },
  dropdownContainerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
});

export default ticketOverviewStyles;
