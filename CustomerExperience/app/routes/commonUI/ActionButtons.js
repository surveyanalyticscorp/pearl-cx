import React from 'react';
import {View, StyleSheet} from 'react-native';
import QPButton from '../../widgets/Button';
import {buttonStyles} from '../../styles/button.styles';
import {Colors} from '../../styles/color.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {HorizontalSpaceBox} from '../../widgets/SpaceBox';
import {translate} from '../../Utils/MultilinguaUtils';

const ActionButtons = ({onCancel, onApply}) => {
  return (
    <View style={[styles.rowContainer, styles.buttonContainer]}>
      <QPButton
        style={[buttonStyles.outlinePrimaryButton, styles.buttonFlex]}
        buttonColor={Colors.white}
        onPress={onCancel}
        textStyle={buttonStyles.outlinePrimaryButtonText}
        buttonText={translate('clear') || 'Clear'}
      />
      <HorizontalSpaceBox multiplyBy={2} />
      <QPButton
        style={[buttonStyles.primaryButton, styles.buttonFlex]}
        buttonColor={Colors.accentLight}
        onPress={onApply}
        textStyle={buttonStyles.primaryButtonText}
        buttonText={translate('apply') || 'Apply'}
      />
    </View>
  );
};

export default ActionButtons;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    paddingHorizontal: PaddingConstants.tab1_2x,
    justifyContent: 'flex-end',
  },
  buttonFlex: {
    flex: 1,
    borderRadius: 8,
  },
});
