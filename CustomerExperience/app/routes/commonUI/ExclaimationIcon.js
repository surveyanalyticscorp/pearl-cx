import React from 'react';
import {Image, Pressable} from 'react-native';
import {Colors} from '../../styles/color.constants';

export const ExclaimationIcon = ({
  onPress,
  size,
  style,
  color,
  endComponent,
}) => {
  return (
    <Pressable style={style} testID="exclaimation-icon" onPress={onPress}>
      <Image
        source={require('./../../../assets/images/exclaimation_icon.png')}
        style={{
          width: size ?? 22,
          height: size ?? 22,
          tintColor: color ?? Colors.critical,
        }}
      />
      {endComponent}
    </Pressable>
  );
};
