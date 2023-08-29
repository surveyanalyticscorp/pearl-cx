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
import {FontFamily} from '../../styles/font.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {TextSizes} from '../../styles/textsize.constants';
import moment from 'moment';
import {
  FullMonthDateYearFormat,
  DMY_AT_TIME_FORMAT,
} from '../../Utils/AppConstants';
import {getStatusById, getPriorityById} from '../../Utils/TicketUtils';
import {CheckBoxItem, RenderStatusIcon} from '../../routes/CommonScreen';
import StringUtils from '../../Utils/StringUtils';
import {useSelector} from 'react-redux';
import {translate} from '../../Utils/MultilinguaUtils';
import {over} from 'lodash';

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

  return (
    <View style={styles.rowContainer}>
      {/* <StatusIcon borderColor={borderColor} fillerColor={fillerColor} /> */}
      <Text style={styles.statusText}>
        {getAssigneeName(assignToId, owners)}
      </Text>
    </View>
  );
};

const StatusUI = ({status}) => {
  return (
    <View style={styles.rowContainer}>
      <RenderStatusIcon size={16} title={getStatusById(status)} />

      {/* <StatusIcon borderColor={borderColor} fillerColor={fillerColor} /> */}
      <Text style={styles.statusText}>{getStatusById(status)}</Text>
    </View>
  );
};

const PriorityUI = ({priority}) => {
  const priorityColor = getPriorityBorderColorbyId(priority);
  const priorityText = getPriorityById(priority);
  return (
    <View style={styles.rowContainer}>
      <IonIcons name="flag" size={20} color={priorityColor} />
      <Text style={[{marginStart: 4}, styles.detailsText]}>{priorityText}</Text>
    </View>
  );
};

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
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={styles.idTitleText}>{`Ticket ID`} </Text>
      <Text style={styles.idText}>{`#${ticketId}`} </Text>
    </View>
  );
};

const NameANdDateRow = ({name, issueDate}) => {
  const date = moment(issueDate).format(FullMonthDateYearFormat);
  // console.log('USERDATA', JSON.stringify(data));
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.userNameText}>{name}</Text>
      <Text style={styles.dateText}>{` · ${date ?? ' '}`}</Text>
    </View>
  );
};

const NPSAndTicketRow = ({nps, ticketId}) => {
  let NPSIcon = () => {
    let icon = require('./../../../assets/images/detractor.png');
    return <Image source={icon} style={{width: 16, height: 16}} />;
  };

  let getNPSColor = () => {
    return Colors.detractor2;
  };

  let GetNPSScore = ({score}) => {
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

  return (
    <View style={styles.rowContainer}>
      <View style={[{flex: 2}, styles.rowContainer]}>
        {nps ? <NPSIcon /> : <View />}
        {nps ? <GetNPSScore score={nps} /> : <View />}
        <View />
      </View>
      <View
        style={[{flex: 2, justifyContent: 'flex-end'}, styles.rowContainer]}>
        <TicketID ticketId={ticketId} />
      </View>
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
      {/* <UserPic avatarUrl={data.userAvatar} /> */}
      <AssigneeUI assignToId={data.assignToId} />
    </View>
  );
};

export default function ClosedLoopCell(props) {
  const data = props.data;

  console.log(JSON.stringify(props));
  const OverdueBar = () => {
    const date = moment(data.overdueDate).format(DMY_AT_TIME_FORMAT);
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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onPressHandler(props.data, props.index);
      }}
      onLongPress={() => {
        props.onLongPressHandler(props.data, props.index);
      }}
      style={[styles.container, {borderTopWidth: data.isOverdue ? 0 : 1}]}>
      <View style={styles.container}>
        {props.showCheckBox && (
          <CheckBoxItem
            item={props.data}
            index={props.index}
            isChecked={props.isChecked}
            title={''}
            onPress={() => {
              props.onPressHandler(props.data, props.index);
            }}
          />
        )}
        <View style={styles.ticketContainer}>
          {data.isOverdue && <OverdueBar />}
          <NPSAndTicketRow nps={data.npsScore} ticketId={data.id} />
          {/* {getTicketID()} */}
          <NameANdDateRow
            name={
              (!StringUtils.isEmpty(data?.panelMember?.name)
                ? data?.panelMember?.name
                : data.panelMember?.email) ?? translate('ticket_list.anonymous')
            }
            issueDate={data.issueDate}
          />
          <TicketDetails comment={data.comment} />
        </View>
        <View>
          <StatusRow data={data} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: MarginConstants.tab1,
    borderColor: Colors.evenDarkerGrey,
    borderStartWidth: 1,
    borderEndWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },

  ticketContainer: {
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    backgroundColor: Colors.white,
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
    fontFamily: FontFamily.regular,

    fontSize: TextSizes.regular,
    color: Colors.filterIconColor,
  },

  idText: {
    fontFamily: FontFamily.regular,

    fontSize: TextSizes.secondary,
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
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.primary,
    marginHorizontal: 4,
    alignSelf: 'center',
  },
  overdueContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    backgroundColor: Colors.overdueBackgroundColor,
  },
  overdueText: {
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.overdueTextColor,
  },
});
