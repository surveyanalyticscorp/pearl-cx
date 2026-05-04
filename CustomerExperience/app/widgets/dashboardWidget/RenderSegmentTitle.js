import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import ListItemSeparator from '../../routes/commonUI/ListItemSeparator';

const HeaderText = ({children}) => (
  <Text
    testID="render-segment-title-text"
    numberOfLines={1}
    ellipsizeMode="tail"
    style={styles.dashboardTitle}>
    {children}
  </Text>
);

const HeaderTailContainer = ({children}) => {
  return <View style={styles.headerTailContainer}>{children}</View>;
};

const DashboardSegmentHeader = ({text, children}) => {
  return (
    <View testID="render-segment-title" style={styles.dashboardTitleContainer}>
      <HeaderText>{text}</HeaderText>
      <HeaderTailContainer>{children}</HeaderTailContainer>
    </View>
  );
};

export default DashboardSegmentHeader;

const styles = StyleSheet.create({
  dashboardTitle: {
    color: Colors.accent,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight._500,
    fontSize: TextSizes.primary,
  },
  dashboardTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab1_2x,
    paddingVertical: PaddingConstants.tab1,
    maxHeight: MarginConstants.tab4 * 1.5,
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 1,
  },
  headerTailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
