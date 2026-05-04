import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '../../../../styles/color.constants';
import {FontFamily} from '../../../../styles/font.constants';
import {TextSizes} from '../../../../styles/textsize.constants';
import {buttonStyles} from '../../../../styles/button.styles';
import QPButton from '../../../../widgets/Button';

const RefineLabel = () => (
  <QPButton
    style={[buttonStyles.textButton, styles.textButton]}
    buttonColor={Colors.white}
    textStyle={[buttonStyles.textButtonText, styles.textButtonText]}
    buttonText={'Refine'}
  />
);

export default RefineLabel;

const styles = StyleSheet.create({
  textButton: {},
  textButtonText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary2,
  },
});
