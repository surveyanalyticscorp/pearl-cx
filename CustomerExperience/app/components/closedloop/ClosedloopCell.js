import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {Colors, getPriorityBorderColorbyId} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {TextSizes} from '../../styles/textsize.constants';
import moment from 'moment';
import {
  FullMonthDateYearFormat,
  DMY_AT_TIME_FORMAT,
  HalfMonthDateYearFormat,
  DMY_AT_TIME__SHORT_FORMAT,
} from '../../Utils/AppConstants';
import {
  Avatar,
  CheckBoxItem,
  ExclaimationIcon,
  ListItemSeparator,
  PriorityUI,
  RenderStatusIcon,
  StatusUI,
} from '../../routes/CommonScreen';
import StringUtils from '../../Utils/StringUtils';
import {useSelector} from 'react-redux';
import {translate} from '../../Utils/MultilinguaUtils';
import {baseTextStyles} from '../../styles/text.styles';

const OverdueAlert = () => {
  return (
    <ExclaimationIcon
      color={Colors.overdueAlertColor}
      size={16}
      style={{flexDirection: 'row', alignItems: 'center'}}
      endComponent={
        <Text
          style={[
            baseTextStyles.secondaryRegularText,
            {
              color: Colors.overdueAlertColor,
              marginEnd: MarginConstants.tab1,
            },
          ]}>
          {`Overdue ticket`}
        </Text>
      }
    />
  );
};

const AssigneeUI = ({assignToId}) => {
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);

  console.log('OWNERS_', JSON.stringify(owners), JSON.stringify(assignToId));
  function getAssigneeName(assignToId, owners_) {
    if (StringUtils.isEmptyOrNull(assignToId)) {
      return assignToId;
    }
    const owner = owners_.find(e => e.ownerID === assignToId);
    return owner['ownerName'] ?? '';
  }

  const title = getAssigneeName(assignToId, owners);

  return (
    <View style={styles.rowContainer}>
      <Avatar title={title} />
      {/* <Text style={styles.statusText}>{title}</Text> */}
    </View>
  );
};

// const StatusUI = ({status}) => {
//   return (
//     <View style={styles.rowContainer}>
//       <RenderStatusIcon size={16} title={getStatusById(status)} />

//       {/* <StatusIcon borderColor={borderColor} fillerColor={fillerColor} /> */}
//       <Text style={styles.statusText}>{getStatusById(status)}</Text>
//     </View>
//   );
// };

const UserPic = ({avatarUrl}) => {
  return (
    <View>
      <Image
        style={{height: 24, width: 24, borderRadius: 50}}
        source={{
          uri: avatarUrl,
        }}
      />
    </View>
  );
};

const TicketID = ({ticketId}) => {
  return <Text style={styles.idText}>{`#${ticketId}`} </Text>;
};

const NameANdDateRow = ({name, issueDate}) => {
  const date = moment(issueDate).format(HalfMonthDateYearFormat);
  // console.log('USERDATA', JSON.stringify(data));
  return (
    <View style={styles.nameAndDateContainer}>
      <Text style={[baseTextStyles.primaryMediumText, {color: Colors.accent}]}>
        {name}
      </Text>
      <Text
        style={[
          baseTextStyles.secondaryRegularText,
          {color: Colors.evenDarkerGrey},
        ]}>{`${date ?? ' '}`}</Text>
    </View>
  );
};

const getNPSColor = () => {
  return Colors.detractor2;
};

const NPSIcon = () => {
  const icon = require('./../../../assets/images/detractor.png');
  return <Image source={icon} style={{width: 24, height: 24}} />;
};

const GetNPSScore = ({score}) => {
  let textColor = getNPSColor();
  return (
    <Text
      style={[
        styles.npsText,
        {
          color: textColor,
          marginHorizontal: MarginConstants.tab1,
        },
      ]}>
      {score}
    </Text>
  );
};

const TicketNPSScore = ({nps}) => {
  return nps ? (
    <View style={styles.npsContainer}>
      <GetNPSScore score={nps} />
      <NPSIcon />
    </View>
  ) : (
    <View style={styles.npsEmptyContainer} />
  );
};
const TicketIdAndOverdueRow = ({data}) => {
  const {id, isOverdue, assignToId} = data;
  return (
    <View style={styles.ticketIdContainer}>
      <TicketID ticketId={id} />

      <AssigneeUI assignToId={assignToId} />
      {/* {isOverdue ? <OverdueAlert /> : <View />} */}
    </View>
  );
};

const TicketDetails = ({comment}) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.detailsText} numberOfLines={3} ellipsizeMode="tail">
        {comment}
      </Text>
    </View>
  );
};

const StatusRow = ({data}) => {
  const {status, priority, nps} = data;
  return (
    <View style={styles.statusContainer}>
      <StatusUI status={status} />
      <PriorityUI style={{flex: 1}} priority={priority} />
      <TicketNPSScore nps={nps} />
    </View>
  );
};

const OverdueBar = ({overdueDate}) => {
  const date = moment(overdueDate).format(DMY_AT_TIME__SHORT_FORMAT);
  const overDueMessage = `${translate('ticket_list.alert')} ${translate(
    'ticket_list.overdue',
  )} ${date}`;
  return (
    <View style={styles.overdueContainer}>
      {/* <IonIcons
        name="notifications-sharp"
        size={20}
        color={Colors.overdueTextColor}
      /> */}
      <ExclaimationIcon
        size={16}
        color={Colors.white}
        style={styles.rowContainer}
        endComponent={
          <Text style={styles.overdueText}>{`Ticket overdue`}</Text>
        }
      />
      <Text style={styles.overdueText}>{date}</Text>
    </View>
  );
};

export default function ClosedLoopCell({
  data,
  index,
  isChecked,
  onLongPressHandler,
  onPressHandler,
  showCheckBox,
}) {
  const name =
    (!StringUtils.isEmpty(data?.panelMember?.name)
      ? data?.panelMember?.name
      : data.panelMember?.email) ?? translate('ticket_list.anonymous');

  // console.log(JSON.stringify(data));

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPressHandler(data, index);
      }}
      onLongPress={() => {
        onLongPressHandler(data, index);
      }}
      style={[styles.container, {borderTopWidth: data.isOverdue ? 0 : 1}]}>
      <View style={styles.container}>
        {showCheckBox && (
          <CheckBoxItem
            item={data}
            index={index}
            isChecked={isChecked}
            title={''}
            onPress={() => {
              onPressHandler(data, index);
            }}
          />
        )}
        <View style={styles.innerContainer}>
          {data?.isOverdue ? (
            <OverdueBar overdueDate={data.overdueDate} />
          ) : (
            <View />
          )}
          <StatusRow data={data} />
          <ListItemSeparator style={{marginHorizontal: MarginConstants.tab1}} />

          <NameANdDateRow
            name={name}
            issueDate={data?.issueDate}
            nps={data?.npsScore}
          />
          <TicketDetails comment={data?.comment} />
          <TicketIdAndOverdueRow data={data} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: MarginConstants.tab1,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    borderRadius: 4,
    backgroundColor: Colors.white,
    paddingBottom: PaddingConstants.tab1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  nameAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  npsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  npsEmptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
    width: MarginConstants.tab3 * 2,
  },
  ticketIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PaddingConstants.tab1,
    paddingTop: PaddingConstants.tab1,
  },

  ticketContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1,
  },
  statusContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: PaddingConstants.tab1,
  },
  userNameText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.accent,
  },

  dateText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.primary,
  },

  detailsText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,
  },

  idText: {
    ...baseTextStyles.primaryRegularText,
    color: Colors.accentLight,
  },

  idTitleText: {
    fontFamily: FontFamily.regular,

    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },

  statusText: {
    ...baseTextStyles.mediumRegularText,
    color: Colors.lightBlack,
    marginHorizontal: 4,
  },
  npsText: {
    ...baseTextStyles.primaryRegularText,
    marginHorizontal: 4,
  },
  overdueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
    backgroundColor: Colors.overdueAlertColor,
  },
  overdueText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.white,
  },
});
