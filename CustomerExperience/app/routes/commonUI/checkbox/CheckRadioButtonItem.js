import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import StringUtils from '../../../Utils/StringUtils';
import {RadioButtonCheckbox} from './RadioButtonCheckbox';

export const CheckRadioButtonItem = ({
  item,
  index,
  onPress,
  textStyle,
  checkBoxRowStyle,
}) => {
  const _textStyle = textStyle ?? styles.checkBoxText;
  return (
    <Pressable testID="check-radio-button-item" onPress={() => onPress(index)}>
      <View style={checkBoxRowStyle ?? styles.checkBoxRow}>
        <RadioButtonCheckbox isChecked={item.isChecked} />
        <Text style={_textStyle}>
          {StringUtils.uppercaseFirstCharRestLowercase(item.title)}
        </Text>
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
