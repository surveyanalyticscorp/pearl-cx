import React, {useMemo, useState} from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import PasswordVisibilitySVGIcon from './../../assets/images/visibility.svg';
import PasswordVisibility_offSVGIcon from './../../assets/images/visibility_off.svg';
import {PaddingConstants} from '../styles/padding.constants';

const VisibilityOnIcon = () => (
  <PasswordVisibilitySVGIcon
    height={24}
    width={24}
    fill={Colors.filterIconColor}
  />
);

const VisibilityOffIcon = () => (
  <PasswordVisibility_offSVGIcon
    height={24}
    width={24}
    fill={Colors.filterIconColor}
  />
);

const RenderPasswordVisibility = ({
  secureText,
  value,
  isPasswordVisible,
  onPress,
}) => {
  const isVisibility = secureText && StringUtils.isNotEmpty(value);
  return isVisibility ? (
    <Pressable
      testID="password-visibility-button"
      style={styles.passwordVisibilityButton}
      onPress={onPress}>
      {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
    </Pressable>
  ) : (
    <View />
  );
};

const QPTextField = props => {
  // NOTE: react-native-paper TextInput is controlled via `value`.
  // So we don't need the old ref/setValue/setNativeProps workaround.
  const [secureText, setSecureText] = useState(!!props.secureText);

  const keyboardType = props.keyboardType ?? 'default';
  const returnKey = props.returnKey ?? 'next';
  const label = props.label ?? '';
  const defaultValue = props.defaultValue ?? '';
  const containerStyle = [props?.style, {paddingVertical: 0}];

  const textStyle = useMemo(
    () =>
      props.textStyle ?? {
        color: Colors.filterIconColor,
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.secondary,
      },
    [props.textStyle],
  );

  const value = props.value ?? '';
  const isPasswordVisible = secureText;

  const onSubmit = () => {
    props.onSubmit && props.onSubmit(value);
  };

  const onEndEditing = () => {
    props.onEndEdit && props.onEndEdit(value);
  };

  const onChange = text => {
    props.onChange && props.onChange(text);
  };

  const changePwdType = () => setSecureText(prev => !prev);

  return (
    <View testID="text-field-container" style={containerStyle}>
      <TextInput
        mode="flat" // closest to old underline style; change to "outlined" if you prefer
        label={label}
        value={value !== '' ? value : props.value ? value : defaultValue}
        placeholder={label} // Show placeholder when not focused and empty
        placeholderTextColor={Colors.evenDarkerGrey}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        secureTextEntry={secureText}
        returnKeyType={returnKey}
        underlineColor={Colors.filterIconColor}
        activeUnderlineColor={Colors.accentLight}
        textColor={Colors.filterIconColor}
        theme={{
          colors: {
            placeholder: Colors.evenDarkerGrey,
            text: Colors.filterIconColor,
            primary: Colors.accentLight,
          },
        }}
        style={[
          {backgroundColor: 'transparent'},
          {fontSize: TextSizes.primary},
          {fontFamily: FontFamily.regular},
          textStyle,
        ]}
        accessibilityLabel={props.accessibilityLabel ?? 'text-field'}
        testID={props.testID ?? 'text-field'}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        onEndEditing={onEndEditing}
      />

      <RenderPasswordVisibility
        secureText={props.secureText}
        value={value}
        isPasswordVisible={isPasswordVisible}
        onPress={changePwdType}
      />
    </View>
  );
};

export default QPTextField;

const styles = StyleSheet.create({
  passwordVisibilityButton: {
    position: 'absolute',
    top: MarginConstants.tab1_4x,
    right: MarginConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
});
