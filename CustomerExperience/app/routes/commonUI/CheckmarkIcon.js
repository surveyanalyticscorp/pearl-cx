import React from 'react';
import {IonIcon} from '../../Utils/IconUtils';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {StyleSheet} from 'react-native';

const CheckmarkIcon = ({index, size, style, color}) => {
  return (
    <IonIcon
      testID={`checkmark-icon-${index ?? 0}`}
      style={style ?? styles.default}
      name={'checkmark'}
      size={size ?? 20}
      color={color ?? Colors.filterIconColor}
    />
  );
};

export default CheckmarkIcon;

const styles = StyleSheet.create({
  default: {marginHorizontal: MarginConstants.halfTab},
});
