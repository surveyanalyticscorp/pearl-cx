import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
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
import {TextSizes} from '../../../styles/textsize.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import InfoIcon from '../../../routes/commonUI/toast/InfoIcon';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import StatusPill from './StatusPill';

const isSmallScreen = Dimensions.get('window').width <= 375;
const smallFontStyle = isSmallScreen ? {fontSize: TextSizes.semiSecondary} : null;

const BottomRow = ({name, issueDate, isOverdue, priority, status}) => {
  const priorityText = getPriorityById(priority);
  const priorityColor = getPriorityBorderColorbyId(priority);
  const date = moment(issueDate).format('MMM DD');

  return (
    <View style={styles.bottomRow}>
      <Avatar title={name} style={styles.avatar} />
      <HorizontalSpaceBox multiplyBy={4} />
      <View style={styles.metaContainer}>
        <View style={styles.dateMetaItem}>
          <View
            style={[
              styles.dateInner,
              isOverdue && styles.dateInnerOverdue,
              isSmallScreen && styles.dateInnerSmall,
            ]}>
            {isOverdue ? (
              <InfoIcon size={22} tintColor={Colors.white} />
            ) : (
              <CalendarIcon size={22} tintColor={Colors.filterIconColor} />
            )}
            <Text
              numberOfLines={1}
              style={[
                baseTextStyles.secondaryRegularText,
                {color: isOverdue ? Colors.white : Colors.lightBlack},
                smallFontStyle,
              ]}>
              {date}
            </Text>
          </View>
        </View>
        <HorizontalSpaceBox multiplyBy={isSmallScreen ? 1 : 2} />

        <View style={styles.priorityMetaItem}>
          <IonIcons name="flag" size={22} color={priorityColor} />
          <Text
            style={[
              baseTextStyles.secondaryRegularText,
              {
                color: Colors.filterIconColor,
                marginStart: MarginConstants.halfTab,
                flexShrink: 1,
              },
              smallFontStyle,
            ]}>
            {priorityText}
          </Text>
        </View>
        <HorizontalSpaceBox multiplyBy={isSmallScreen ? 1 : 2} />

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
  dateMetaItem: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  priorityMetaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  dateInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  dateInnerSmall: {
    paddingHorizontal: PaddingConstants.halfTab,
  },
  dateInnerOverdue: {
    backgroundColor: Colors.critical2,
    borderRadius: 4,
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  statusPillCell: {
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export default BottomRow;
