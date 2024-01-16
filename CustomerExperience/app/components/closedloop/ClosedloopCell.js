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
} from '../../Utils/AppConstants';
import {
  Avatar,
  CheckBoxItem,
  ExclaimationIcon,
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

const NameANdDateRow = ({name, issueDate, nps}) => {
  const date = moment(issueDate).format(HalfMonthDateYearFormat);
  // console.log('USERDATA', JSON.stringify(data));
  return (
    <View style={styles.rowContainer}>
      <Text style={[baseTextStyles.primaryMediumText, {color: Colors.accent}]}>
        {name}
      </Text>
      <Text
        style={[
          baseTextStyles.secondaryRegularText,
          {color: Colors.evenDarkerGrey},
        ]}>{`· ${date ?? ' '}`}</Text>
      <TicketNPSScore nps={nps} />
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
  return (
    <View
      style={[
        {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
        styles.rowContainer,
      ]}>
      {nps ? <NPSIcon /> : <View />}
      {nps ? <GetNPSScore score={nps} /> : <View />}
      <View />
    </View>
  );
};
const TicketIdAndOverdueRow = ({ticketId, isOverdue}) => {
  return (
    <View style={styles.ticketIdContainer}>
      <TicketID ticketId={ticketId} />
      {isOverdue ? <OverdueAlert /> : <View />}
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
  return (
    <View style={styles.statusContainer}>
      <StatusUI status={data.status} />
      <PriorityUI priority={data.priority} />
      <AssigneeUI assignToId={data.assignToId} />
    </View>
  );
};

const OverdueBar = ({overdueDate}) => {
  const date = moment(overdueDate).format(DMY_AT_TIME_FORMAT);
  const overDueMessage = `${translate('ticket_list.alert')} ${translate(
    'ticket_list.overdue',
  )} ${date}`;
  return (
    <View style={styles.overdueContainer}>
      <IonIcons
        name="notifications-sharp"
        size={20}
        color={Colors.overdueTextColor}
      />
      <Text style={styles.overdueText}>{overDueMessage}</Text>
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
          <TicketIdAndOverdueRow
            isOverdue={data?.isOverdue}
            ticketId={data?.id}
          />
          <NameANdDateRow
            name={name}
            issueDate={data?.issueDate}
            nps={data?.npsScore}
          />
          <TicketDetails comment={data?.comment} />
          <StatusRow data={data} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: MarginConstants.tab1,
    padding: PaddingConstants.tab1,

    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    color: Colors.lightBlack,
    marginHorizontal: 4,
  },
  npsText: {
    fontFamily: FontFamily.secondary,
    fontSize: TextSizes.primary,
    marginHorizontal: 4,
  },
  overdueContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
    backgroundColor: Colors.overdueBackgroundColor,
  },
  overdueText: {
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.overdueTextColor,
  },
});
