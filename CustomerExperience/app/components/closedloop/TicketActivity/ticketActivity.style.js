import {StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontWeight} from '../../../styles/font.constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  rootContainer: {
    flex: 1,
    margin: MarginConstants.tab1,
  },

  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  renderItemStyle: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'space-between',
    paddingVertical: PaddingConstants.halfTab,
  },
  myRenderItemStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  myRenderItemContainerStyle: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
    borderRadius: 5,
    padding: MarginConstants.tab1_2x,
  },
  renderItemContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: PaddingConstants.halfTab,
    margin: MarginConstants.tab1,
    borderRadius: 5,
  },
  userName: {
    ...baseTextStyles.primaryRegularText,
    color: Colors.accent,
  },
  activity: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight._400,
    flex: 1,
  },
  normalText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight._400,
    flex: 1,
  },
  boldText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight.bold,
    flex: 1,
  },
  date: {
    flex: 1,
    color: Colors.evenDarkerGrey,
    ...baseTextStyles.semiSecondaryRegularText,
    marginStart: MarginConstants.halfTab,
    textAlign: 'right',
  },
  sortingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: MarginConstants.halfTab,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});

export default styles;
