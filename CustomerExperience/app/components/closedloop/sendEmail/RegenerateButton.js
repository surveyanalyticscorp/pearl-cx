import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import RegenerateIcon from '../../../assets/images/regenerate.svg';

const RegenerateButton = ({onPress, isSmallScreen}) => (
  <Pressable
    onPress={onPress}
    style={[styles.button, isSmallScreen && styles.buttonCompact]}>
    <View style={styles.labelRow}>
      <RegenerateIcon
        height={MarginConstants.tab1_2x}
        width={MarginConstants.tab1_2x}
        color={Colors.accentLightBlue}
      />
      <Text style={[styles.label, isSmallScreen && styles.labelCompact]}>
        {'Regenerate'}
      </Text>
    </View>
  </Pressable>
);

export default RegenerateButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonCompact: {
    marginEnd: MarginConstants.tab1,
    padding: PaddingConstants.halfTab,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: TextSizes.secondary2,
    fontFamily: FontFamily.regular,
    marginHorizontal: MarginConstants.tab1,
    color: Colors.accentLightBlue,
  },
  labelCompact: {
    fontSize: TextSizes.semiSecondary,
    marginHorizontal: MarginConstants.halfTab,
  },
});
