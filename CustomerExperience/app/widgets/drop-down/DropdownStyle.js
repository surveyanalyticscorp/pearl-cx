import {StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';

export const styles = StyleSheet.create({
  buttonText: {
    fontSize: TextSizes.mediumText,
    color: textColors.secondary,
  },
  modal: {
    flexGrow: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    justifyContent: 'center',
  },
  list: {},
  rowText: {
    paddingHorizontal: PaddingConstants.halfTab,
    paddingVertical: PaddingConstants.tab1,
    fontSize: TextSizes.mediumText,
    textAlignVertical: 'center',
  },
  separator: {
    height: 0.5,
  },
  dropdownArrow: {
    alignSelf: 'center',
    marginTop: MarginConstants.halfTab,
  },
  dropdownLeftArrow: {
    alignSelf: 'center',
    marginTop: MarginConstants.halfTab,
  },
  mainView: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: MarginConstants.halfTab,
  },
});
