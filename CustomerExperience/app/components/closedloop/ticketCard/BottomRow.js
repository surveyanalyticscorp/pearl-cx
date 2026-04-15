import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Colors,
  getPriorityBorderColorbyId,
} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import moment from 'moment';
import {Avatar, CalendarIcon} from '../../../routes/commonUI/CommonUI';
import {baseTextStyles} from '../../../styles/text.styles';
import {getPriorityById} from '../../../Utils/TicketUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import InfoIcon from '../../../routes/commonUI/toast/InfoIcon';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import StatusPill from './StatusPill';

const BottomRow = ({name, issueDate, isOverdue, priority, status}) => {
  const priorityText = getPriorityById(priority);
  const priorityColor = getPriorityBorderColorbyId(priority);
  const date = moment(issueDate).format('MMM DD');

  return (
    <View style={styles.bottomRow}>
      <Avatar title={name} style={styles.avatar} />
      <HorizontalSpaceBox multiplyBy={4} />
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <View
            style={[styles.dateInner, isOverdue && styles.dateInnerOverdue]}>
            {isOverdue ? (
              <InfoIcon size={22} tintColor={Colors.white} />
            ) : (
              <CalendarIcon size={22} tintColor={Colors.filterIconColor} />
            )}
            <Text
              style={[
                baseTextStyles.secondaryRegularText,
                {color: isOverdue ? Colors.white : Colors.lightBlack},
              ]}>
              {date}
            </Text>
          </View>
        </View>
        <HorizontalSpaceBox multiplyBy={4} />

        <View style={styles.metaItem}>
          <IonIcons name="flag" size={22} color={priorityColor} />
          <Text
            style={[
              baseTextStyles.secondaryRegularText,
              {
                color: Colors.filterIconColor,
                marginStart: MarginConstants.halfTab,
              },
            ]}>
            {priorityText}
          </Text>
        </View>
        <HorizontalSpaceBox multiplyBy={4} />

        <View style={styles.statusPillCell}>
          <StatusPill status={status} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginHorizontal: 0,
  },
  metaContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dateInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  dateInnerOverdue: {
    backgroundColor: Colors.critical2,
    borderRadius: 4,
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  statusPillCell: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export default BottomRow;
