import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import QPButton from '../../widgets/Button';
import {buttonStyles} from '../../styles/button.styles';
import {TextSizes} from '../../styles/textsize.constants';
import {Colors} from '../../styles/color.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {HorizontalSpaceBox} from '../../widgets/SpaceBox';
import {translate} from '../../Utils/MultilinguaUtils';

const isSmallScreen = Dimensions.get('window').width <= 375;

const ActionButtons = ({onCancel, onApply}) => {
  return (
    <View style={[styles.rowContainer, styles.buttonContainer, isSmallScreen && styles.buttonContainerSmall]}>
      <QPButton
        style={[
          buttonStyles.outlinePrimaryButton,
          styles.buttonFlex,
          isSmallScreen && styles.buttonSmall,
        ]}
        buttonColor={Colors.white}
        onPress={onCancel}
        textStyle={[
          buttonStyles.outlinePrimaryButtonText,
          isSmallScreen && styles.buttonTextSmall,
        ]}
        buttonText={translate('clear') || 'Clear'}
      />
      <HorizontalSpaceBox multiplyBy={isSmallScreen ? 1 : 2} />
      <QPButton
        style={[
          buttonStyles.primaryButton,
          styles.buttonFlex,
          isSmallScreen && styles.buttonSmall,
        ]}
        buttonColor={Colors.accentLight}
        onPress={onApply}
        textStyle={[
          buttonStyles.primaryButtonText,
          isSmallScreen && styles.buttonTextSmall,
        ]}
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
  buttonContainerSmall: {
    paddingHorizontal: PaddingConstants.halfTab,
  },
  buttonSmall: {
    height: MarginConstants.tab1_5x,
    paddingHorizontal: MarginConstants.tab1,
  },
  buttonTextSmall: {
    fontSize: TextSizes.semiSecondary,
  },
});
