import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CloseButton} from './CommonUI';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';

export const PageHeaderText = ({text, hasCloseButton = false}) => {
  return (
    <View style={styles.pageHeaderStyle}>
      <Text style={styles.headerText}>{text}</Text>
      {hasCloseButton ? (
        <CloseButton color={Colors.filterIconColor} />
      ) : (
        <View />
      )}
    </View>
  );
};

export default PageHeaderText;
const styles = StyleSheet.create({
  pageHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
});
