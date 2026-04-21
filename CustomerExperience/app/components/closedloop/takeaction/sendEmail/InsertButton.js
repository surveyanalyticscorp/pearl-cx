import React from 'react';
import {Colors} from '../../../../styles/color.constants';
import {buttonStyles} from '../../../../styles/button.styles';
import QPButton from '../../../../widgets/Button';

const InsertButton = ({onPress}) => (
  <QPButton
    buttonText={'Insert'}
    buttonColor={Colors.accentLight}
    onPress={onPress}
    textStyle={buttonStyles.primaryButtonText}
    style={{flexDirection: 'row', ...buttonStyles.primaryButton, borderRadius: 2}}
  />
);

export default InsertButton;
