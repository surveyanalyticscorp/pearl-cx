import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {FaIcon} from '../../../Utils/IconUtils';
import DropDownIcon from '../../../assets/images/dropdown_icon.svg';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import StringUtils from '../../../Utils/StringUtils';

const RefineButton = ({
  selectedRefineOptions,
  onPress,
  isOpen,
  isSmallScreen,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.button, isSmallScreen && styles.buttonCompact]}>
    <View style={styles.labelRow}>
      <DropDownIcon
        height={MarginConstants.tab1_2x}
        width={MarginConstants.tab1_2x}
        color={Colors.accentLight}
      />
      <Text style={[styles.label, isSmallScreen && styles.labelCompact]}>
        {'Refine'}
      </Text>
    </View>
  </Pressable>
);

export default RefineButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
    borderColor: Colors.borderColor,
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
    color: Colors.accentLight,
  },
  labelCompact: {
    fontSize: TextSizes.semiSecondary,
    marginHorizontal: MarginConstants.halfTab,
  },
});
