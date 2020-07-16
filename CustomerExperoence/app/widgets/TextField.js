import React from 'react';
import {TextField} from 'react-native-material-textfield';
import {Colors} from '../styles/color.constants';

const QPTextField = props => {
  const fieldRef = React.createRef();

  const onSubmit = () => {
    let {current: field} = fieldRef;
    props.onSubmit && props.onSubmit(field.value());
  };

  const onChange = () => {
    let {current: field} = fieldRef;
    props.onChange && props.onChange(field.value());
  };

  let keyboardType = props.keyboardType ? props.keyboardType : 'default';
  let label = props.label ? props.label : '';
  let style = [props.style, {paddingVertical: 0}]
  return (
    <TextField
      underlineColorAndroid="transparent"
      autoCapitalize={'none'}
      autoCorrect={false}
      tintColor={Colors.textTintColor}
      containerStyle={style}
      label={label}
      keyboardType={keyboardType}
      onSubmitEditing={onSubmit}
      onChangeText={onChange}
      ref={fieldRef}
    />
  );
};
export default QPTextField;
