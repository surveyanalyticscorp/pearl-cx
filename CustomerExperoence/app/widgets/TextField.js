import React, {useState} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TextField} from 'react-native-material-textfield';
import {Colors} from '../styles/color.constants';

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

  const onChange = () => {
    let {current: field} = fieldRef;
    props.onChange && props.onChange(field.value());
  };

  const changePwdType = () => {
    setSecureText(!secureText);
  };

  let keyboardType = props.keyboardType ? props.keyboardType : 'default';
  let label = props.label ? props.label : '';
  let style = [props.style, {paddingVertical: 0}];
  let icon = secureText ? 'visibility-off' : 'visibility';

  let renderVisibility = () => {
    return (
      <Icon
        style={{
          position: 'absolute',
          top: 33,
          right: 0,
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
        tintColor={Colors.textTintColor}
        label={label}
        secureTextEntry={secureText}
        keyboardType={keyboardType}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmit}
        onChangeText={onChange}
        ref={fieldRef}
      />
      {props.secureText && renderVisibility()}
    </View>
  );
};
export default QPTextField;
