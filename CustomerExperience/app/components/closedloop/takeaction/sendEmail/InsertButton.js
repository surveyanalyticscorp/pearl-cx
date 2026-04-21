import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '../../../../styles/color.constants';
import {MarginConstants} from '../../../../styles/margin.constants';
import {TextSizes} from '../../../../styles/textsize.constants';
import {FontFamily} from '../../../../styles/font.constants';
import QPButton from '../../../../widgets/Button';

const InsertButton = ({onPress, isSmallScreen}) => (
  <QPButton
    buttonText={'Insert'}
    buttonColor={Colors.accentLight}
    onPress={onPress}
    textStyle={[styles.text, isSmallScreen && styles.textCompact]}
    style={[styles.button, isSmallScreen && styles.buttonCompact]}
  />
);

export default InsertButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: MarginConstants.tab1_6x,
    paddingHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonCompact: {
    paddingHorizontal: MarginConstants.tab1,
    height: MarginConstants.tab1_5x,
  },
  text: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary2,
  },
  textCompact: {
    fontSize: TextSizes.semiSecondary,
  },
});
