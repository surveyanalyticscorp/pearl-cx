import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';

export const ChipItem = ({
  item,
  title,
  isChecked,
  index,
  onPress,
  textStyle,
  style,
  isDisabled = false,
}) => {
  const isActive = item?.isChecked ?? isChecked;
  const chipStyle = [
    styles.chipContainer,
    isActive ? styles.chipActive : styles.chipInactive,
    style,
  ];

  const chipTextStyle = [
    styles.chipText,
    textStyle,
    isActive ? styles.chipTextActive : styles.chipTextInactive,
  ];

  return (
    <Pressable
      isDisabled={isDisabled}
      testID="chip-button"
      style={[chipStyle, {opacity: isDisabled ? 0.5 : 1}]}
      onPress={() => (isDisabled ? null : onPress(item, index))}>
      <Text style={chipTextStyle}>{item?.title ? item.title : title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    borderRadius: 20,
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
    margin: MarginConstants.tab1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: MarginConstants.tab1_8x,
  },
  chipInactive: {
    backgroundColor: '#EEF3FB',
  },
  chipActive: {
    backgroundColor: '#045EBF',
  },
  chipText: {
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  chipTextInactive: {
    color: '#545E6B',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
