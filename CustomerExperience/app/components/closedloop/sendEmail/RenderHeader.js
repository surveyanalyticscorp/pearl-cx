import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {CloseButton} from '../../../routes/commonUI/CommonUI';

const RenderHeader = () => {
  return (
    <View style={styles.rowContainerHeader}>
      <Text style={styles.headerText}>Respond via email</Text>
      <CloseButton color={Colors.filterIconColor} />
    </View>
  );
};

export default RenderHeader;

const styles = StyleSheet.create({
  rowContainerHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.accent,
  },
});
