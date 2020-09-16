import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TextField} from 'react-native-material-textfield';
import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';

const QPTextField = props => {
  const fieldRef = React.createRef();
  const [secureText, setSecureText] = useState(props.secureText);
  const onSubmit = () => {
    let {current: field} = fieldRef;
    props.onSubmit && props.onSubmit(field.value());
  };

  const onEndEditing = () => {
    let {current: field} = fieldRef;
    props.onEndEdit && props.onEndEdit(field.value());
  };

  const onChange = text => {
    // let {current: field} = fieldRef;
    props.onChange && props.onChange(text);
  };

  const changePwdType = () => {
    setSecureText(!secureText);
  };

  let keyboardType = props.keyboardType ? props.keyboardType : 'default';
  let label = props.label ? props.label : '';
  let defaultValue = props.defaultValue ? props.defaultValue : '';
  let style = [props.style, {paddingVertical: 0}];
  let icon = secureText ? 'visibility-off' : 'visibility';

  let renderVisibility = () => {
    return StringUtils.isNotEmpty(props.value) && (
      <Icon
        style={{
          position: 'absolute',
          top: 33,
          right: Platform.select({
            ios: 40,
            android: 10
          })
        }}
        name={icon}
        size={25}
        color={Colors.white}
        onPress={changePwdType}
      />
    );
  };

  return (
    <View style={style}>
      <TextField
        underlineColorAndroid="transparent"
        autoCapitalize={'none'}
        autoCorrect={false}
        autoFocus={props.autofocus}
        tintColor={props.tintColor || Colors.textTintColor}
        label={label}
        defaultValue={defaultValue}
        secureTextEntry={secureText}
        keyboardType={keyboardType}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmit}
        onChangeText={onChange}
        ref={fieldRef}
        clearButtonMode={'always'}
        placeholder={props.placeholder}
      />
      {props.secureText && renderVisibility()}
    </View>
  );
};
export default QPTextField;
