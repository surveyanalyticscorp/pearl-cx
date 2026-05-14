import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {isNull} from 'lodash';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';

const ActionHistory = ({children}) => {
  const {summary} = useSelector(state => state.dashboard.ticketActionHistory);

  if (!isNull(summary?.data?.action)) {
    return (
      <View style={styles.actionHistoryContainer}>
        <Text style={styles.actionHistoryHeader}>Action history</Text>
        {children}
      </View>
    );
  }
  return <View />;
};

export default ActionHistory;

const styles = StyleSheet.create({
  actionHistoryContainer: {
    margin: MarginConstants.tab2,
    paddingTop: PaddingConstants.tab1,
  },
  actionHistoryHeader: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },
});
