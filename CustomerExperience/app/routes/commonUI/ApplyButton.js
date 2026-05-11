import React from 'react';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {buttonStyles} from '../../styles/button.styles';
import QPButton from '../../widgets/Button';

export const ApplyButton = ({onPress, buttonText}) => (
  <QPButton
    buttonColor={Colors.accentLight}
    testID="ApplyButton"
    style={[buttonStyles.primaryButton, {marginVertical: MarginConstants.tab2}]}
    onPress={onPress}
    buttonText={buttonText ?? 'Apply'}
    textStyle={buttonStyles.primaryButtonText}
  />
);
