import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {FaIcon} from '../../../Utils/IconUtils';
import {MarginConstants} from '../../../styles/margin.constants';
import StringUtils from '../../../Utils/StringUtils';
import DropDownIcon from '../../../../assets/images/dropdown_icon.svg';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';

function DropDownButton({
  label,
  onPress,
  isOpen,
  onLayout,
  style,
  hasIcon = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout}
      style={[styles.dropDownButton, style]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {hasIcon && (
          <DropDownIcon
            height={MarginConstants.tab1_2x}
            width={MarginConstants.tab1_2x}
            color={Colors.filterIconColor}
          />
        )}
        <Text style={{...styles.chipButtonText, color: Colors.filterIconColor}}>
          {StringUtils.uppercaseFirstChar(label)}
        </Text>
      </View>
      <View>
        <FaIcon
          name={isOpen ? 'caret-down' : 'caret-up'}
          size={MarginConstants.tab1_2x}
          color={Colors.filterIconColor}
        />
        <HorizontalSpaceBox />
      </View>
    </Pressable>
  );
}

export default DropDownButton;

const styles = StyleSheet.create({
  dropDownButton: {
    flexDirection: 'row',
    marginEnd: MarginConstants.tab1_4x,
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
    width: MarginConstants.tab1_16x + MarginConstants.tab1_4x,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: Colors.borderColor,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  chipButtonText: {
    fontSize: TextSizes.secondary2,
    fontFamily: FontFamily.regular,
    marginHorizontal: MarginConstants.tab1_2x,
  },
});
