import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {isNull} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import NoActionView from './NoActionView';

const ActionHistoryItem = () => {
  const navigation = useNavigation();
  const {summary} = useSelector(state => state.dashboard.ticketActionHistory);
  const actionDetails = summary?.data?.action ?? null;
  const ticketId = useSelector(state => state.dashboard?.ticket?.id);

  if (isNull(actionDetails)) {
    return <NoActionView />;
  }

  const emailSubject = summary?.data?.action?.subject ?? 'Default subject';
  const senderName = summary?.data?.action?.emailSendBy ?? 'Default sender';
  const actionCount = (summary?.data?.totalAction ?? 0).toString();
  const timeStamp = convertDateTimeAgo(summary?.data?.action?.createdAt);

  const onItemPress = () => {
    navigation.navigate('actionEmailHistory', {
      ticketId: ticketId,
    });
  };

  return (
    <Pressable onPress={onItemPress} style={styles.actionHistoryItemContainer}>
      <Text style={styles.actionHistorySubjectText}>{emailSubject}</Text>
      <View style={styles.actionHistoryItemDetails}>
        <Text style={styles.actionHistoryDetailText}>by: </Text>
        <Text style={[styles.actionHistoryDetailText, styles.italic]}>
          {senderName}
        </Text>
        <View style={styles.verticalDevider} />
        <Text style={styles.actionHistoryDetailText}>{timeStamp}</Text>
        <View style={styles.verticalDevider} />
        <Text
          style={
            styles.actionHistoryDetailText
          }>{`total actions: ${actionCount}`}</Text>
      </View>
    </Pressable>
  );
};

export default ActionHistoryItem;

const styles = StyleSheet.create({
  actionHistoryItemContainer: {
    margin: MarginConstants.tab1,
    paddingTop: PaddingConstants.tab1,
  },
  actionHistoryItemDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  actionHistorySubjectText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  actionHistoryDetailText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    color: Colors.filterIconColor,
  },
  italic: {
    fontStyle: 'italic',
  },
  verticalDevider: {
    width: 1,
    flexDirection: 'row',
    backgroundColor: Colors.filterIconColor,
    marginHorizontal: MarginConstants.tab1,
    marginVertical: MarginConstants.halfTab,
  },
});
