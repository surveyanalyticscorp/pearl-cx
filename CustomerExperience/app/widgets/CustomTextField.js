import React, {useState, useRef, useEffect} from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  TextInput,
  Text,
  Animated,
} from 'react-native';
import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import PasswordVisibilitySVGIcon from './../../assets/images/visibility.svg';
import PasswordVisibility_offSVGIcon from './../../assets/images/visibility_off.svg';
import {PaddingConstants} from '../styles/padding.constants';

const VisibilityOnIcon = () => {
  return (
    <PasswordVisibilitySVGIcon
      height={24}
      width={24}
      fill={Colors.filterIconColor}
    />
  );
};

const VisibilityOffIcon = () => {
  return (
    <PasswordVisibility_offSVGIcon
      height={24}
      width={24}
      fill={Colors.filterIconColor}
    />
  );
};

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

const CustomTextField = props => {
  const fieldRef = props.ref ?? useRef();
  const [secureText, setSecureText] = useState(props.secureText);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(props.defaultValue || '');

  // Animation for floating label
  const labelAnimation = useRef(
    new Animated.Value(
      props.value || props.defaultValue || internalValue ? 1 : 0,
    ),
  ).current;

  const currentValue = props.value !== undefined ? props.value : internalValue;
  const hasValue = StringUtils.isNotEmpty(currentValue);

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue, labelAnimation]);

  const onSubmit = () => {
    props.onSubmit && props.onSubmit(currentValue);
  };

  const onEndEditing = () => {
    setIsFocused(false);
    props.onEndEdit && props.onEndEdit(currentValue);
  };

  const onFocus = () => {
    setIsFocused(true);
  };

  const onChange = text => {
    if (props.value === undefined) {
      setInternalValue(text);
    }
    props.onChange && props.onChange(text);
  };

  const changePwdType = () => {
    setSecureText(!secureText);
  };

  // Add value() method to ref for compatibility
  if (fieldRef.current) {
    fieldRef.current.value = () => currentValue;
  }

  let keyboardType = props.keyboardType ? props.keyboardType : 'default';
  let returnKey = props.returnKey ? props.returnKey : 'next';
  let label = props.label ? props.label : '';
  let defaultValue = props.defaultValue ? props.defaultValue : '';
  let style = [props?.style, {paddingVertical: 0}];
  let isPasswordVisible = secureText;
  let textStyle = props.textStyle
    ? props.textStyle
    : {color: Colors.filterIconColor, fontFamily: FontFamily.regular};

  // Color calculations
  const tintColor = props.tintColor || Colors.accentLight;
  const textColor = props.textColor || Colors.primary;
  const baseColor = props.baseColor || Colors.primary;
  const placeholderTextColor = props.placeholderTextColor || Colors.borderColor;

  // Label styles
  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const labelFontSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [TextSizes.primary, TextSizes.secondary],
  });

  const labelColor = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [placeholderTextColor, isFocused ? tintColor : baseColor],
  });

  const underlineColor = isFocused ? tintColor : baseColor;

  return (
    <View testID="text-field-container" style={[styles.container, style]}>
      {/* Floating Label */}
      {label ? (
        <Animated.Text
          style={[
            styles.label,
            textStyle,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
            },
          ]}>
          {label}
        </Animated.Text>
      ) : null}

      {/* Text Input */}
      <TextInput
        key={props.value || 'empty'} // Force re-render when value changes
        ref={fieldRef}
        style={[
          styles.textInput,
          textStyle,
          {
            color: textColor,
            fontSize: TextSizes.primary,
            paddingTop: label ? 20 : 16,
          },
        ]}
        accessibilityLabel={props.accessibilityLabel ?? 'text-field'}
        testID={props.testID ?? 'text-field'}
        underlineColorAndroid="transparent"
        autoCapitalize={props.autoCapitalize || 'none'}
        autoCorrect={props.autoCorrect || false}
        autoFocus={props.autofocus}
        value={currentValue}
        defaultValue={props.value !== undefined ? undefined : defaultValue}
        secureTextEntry={secureText}
        keyboardType={keyboardType}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmit}
        onChangeText={onChange}
        onFocus={onFocus}
        placeholder={isFocused || hasValue ? '' : props.placeholder}
        placeholderTextColor={placeholderTextColor}
        returnKeyType={returnKey}
        selectionColor={tintColor}
      />

      {/* Underline */}
      <View
        style={[
          styles.underline,
          {
            backgroundColor: underlineColor,
            height: isFocused ? 2 : 1,
          },
        ]}
      />

      {/* Password Visibility Toggle */}
      <RenderPasswordVisibility
        secureText={props.secureText}
        value={currentValue}
        isPasswordVisible={isPasswordVisible}
        onPress={changePwdType}
      />
    </View>
  );
};

export default CustomTextField;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    marginVertical: 8,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  textInput: {
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingBottom: 8,
    paddingTop: 20,
    margin: 0,
    minHeight: 48,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  passwordVisibilityButton: {
    position: 'absolute',
    top: MarginConstants.tab4,
    right: MarginConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
    zIndex: 2,
  },
});
