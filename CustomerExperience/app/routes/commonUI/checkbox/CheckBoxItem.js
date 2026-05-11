import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {CheckBox} from './CheckBox';

export const CheckBoxItem = ({
  item,
  title,
  isChecked,
  index,
  onPress,
  textStyle,
  style,
  isDisabled = false,
}) => {
  const _textStyle = textStyle ?? styles.checkBoxText;
  return (
    <Pressable
      isDisabled={isDisabled}
      testID="check-box-button"
      style={[style, {opacity: isDisabled ? 0.5 : 1}]}
      onPress={() => (isDisabled ? null : onPress(item, index))}>
      <View style={styles.checkBoxRow}>
        <CheckBox isChecked={item?.isChecked ?? isChecked} />
        <Text style={_textStyle}>{item?.title ? item.title : title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkBoxRow: {
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
  },
  checkBoxText: {
    color: Colors.filterIconColor,
    textAlign: 'center',
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
});
