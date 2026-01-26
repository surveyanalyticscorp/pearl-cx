import React, {useState} from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import {TextField} from 'react-native-material-textfield';
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

const QPTextField = props => {
  const fieldRef = props.ref ?? React.createRef();
  const [secureText, setSecureText] = useState(props.secureText);

  // Imperatively update the text field when value changes from persistence
  React.useEffect(() => {
    if (fieldRef.current && props.value && props.value !== '') {
      // Force update the underlying text input
      if (fieldRef.current.setValue) {
        fieldRef.current.setValue(props.value);
      } else if (
        fieldRef.current._textInput &&
        fieldRef.current._textInput.setNativeProps
      ) {
        fieldRef.current._textInput.setNativeProps({text: props.value});
      }
    }
  }, [props.value]);

  const onSubmit = () => {
    let {current: field} = fieldRef;
    props.onSubmit && props.onSubmit(field.value());
  };

  const onEndEditing = () => {
    let {current: field} = fieldRef;
    props.onEndEdit && props.onEndEdit(field.value());
  };

  const onChange = text => {
    props.onChange && props.onChange(text);
  };

  const changePwdType = () => {
    setSecureText(!secureText);
  };

  let keyboardType = props.keyboardType ? props.keyboardType : 'default';
  let returnKey = props.returnKey ? props.returnKey : 'next';
  let label = props.label ? props.label : '';
  let defaultValue = props.defaultValue ? props.defaultValue : '';
  let style = [props?.style, {paddingVertical: 0}];
  let isPasswordVisible = secureText;
  let textStyle = props.textStyle
    ? props.textStyle
    : {color: Colors.filterIconColor, fontFamily: FontFamily.regular};

  return (
    <View testID="text-field-container" style={style}>
      <TextField
        labelTextStyle={textStyle}
        titleTextStyle={textStyle}
        affixTextStyle={textStyle}
        style={textStyle}
        accessibilityLabel={props.accessibilityLabel ?? 'text-field'}
        testID={props.testID ?? 'text-field'}
        underlineColorAndroid="transparent"
        autoCapitalize={'none'}
        autoCorrect={false}
        autoFocus={props.autofocus}
        tintColor={props.tintColor || Colors.accentLight}
        textColor={props.textColor || Colors.primary}
        baseColor={props.baseColor || Colors.primary}
        label={label}
        value={props.value}
        placeholderTextColor={Colors.borderColor}
        defaultValue={props.value ? undefined : defaultValue}
        secureTextEntry={secureText}
        keyboardType={keyboardType}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmit}
        onChangeText={onChange}
        ref={fieldRef}
        placeholder={props.placeholder}
        fontSize={TextSizes.primary}
        labelFontSize={TextSizes.secondary}
        returnKeyType={returnKey}
      />

      <RenderPasswordVisibility
        secureText={props.secureText}
        value={props.value}
        isPasswordVisible={isPasswordVisible}
        onPress={changePwdType}
      />
    </View>
  );
};
export default QPTextField;

const styles = StyleSheet.create({
  passwordVisibilityButton: {
    flex: 1,
    position: 'absolute',
    top: MarginConstants.tab4,
    right: MarginConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
});
