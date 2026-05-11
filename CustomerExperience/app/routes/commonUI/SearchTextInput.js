import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';

export const SearchTextInput = React.forwardRef((props, ref) => {
  const inputStyles = StyleSheet.create({
    search: {
      padding: PaddingConstants.halfTab,
      margin: MarginConstants.halfTab,
      borderColor: Colors.filterIconColor,
      borderBottomWidth: 0.5,
    },
  });
  return (
    <TextInput
      ref={ref}
      defaultValue={props.defaultValue ?? ''}
      style={props.style ?? inputStyles.search}
      placeholder={props.placeholder}
      returnKeyType={props.returnKeyType}
      onChangeText={props.onChangeText}
    />
  );
});
