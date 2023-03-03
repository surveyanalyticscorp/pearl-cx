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
import {RenderStatusIcon} from '../../routes/CommonScreen';
import StringUtils from '../../Utils/StringUtils';

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
      <Text style={styles.userNameText}>{name ?? 'anonymous'}</Text>
      <Text style={styles.dateText}>{` · ${date ?? ' '}`}</Text>
    </View>
  );
};

const NPSAndTicketRow = ({ticketId}) => {
  return (
    <View style={styles.rowContainer}>
      {/* <View style={[{flex: 2}, styles.rowContainer]}>
        {getNPSIcon(data.nps)}
        {getNPSScore(data.npsScore, data.nps)}
      </View> */}
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
      <UserPic avatarUrl={data.userAvatar} />
    </View>
  );
};

export default function ClosedLoopCell(props) {
  const data = props.data;

  let getNPSIcon = (sentiment) => {
    let icon;
    switch (sentiment) {
      case 'Detractor':
        icon = require('./../../../assets/images/detractor.png');
        break;
      case 'Passive':
        icon = require('./../../../assets/images/passive.png');
        break;
      default:
        icon = require('./../../../assets/images/promoter.png');
        break;
    }

    return <Image source={icon} style={{width: 16, height: 16}} />;
  };

  let getNPSColor = (sentiment) => {
    switch (sentiment) {
      case 'Detractor':
        return Colors.detractor2;
      case 'Passive':
        return Colors.passive2;
      default:
        return Colors.promoter2;
    }
  };

  let getNPSScore = (score, sentiment) => {
    let textColor = getNPSColor(sentiment);
    return (
      <Text
        style={[
          styles.statusText,
          {
            color: textColor,
            marginHorizontal: MarginConstants.tab1,
          },
        ]}>
        {score}
      </Text>
    );
  };

  const OverdueBar = () => {
    const date = moment(data.overdueDate).format(DMY_AT_TIME_FORMAT);
    return (
      <View style={styles.overdueContainer}>
        <IonIcons
          name="notifications-sharp"
          size={20}
          color={Colors.overdueTextColor}
        />

        <Text style={styles.overdueText}>{`Alert!  Overdue (${date})`}</Text>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onPressHandler(props.data, props.index);
      }}
      style={[styles.container, {borderTopWidth: data.isOverdue ? 0 : 1}]}>
      <View style={styles.container}>
        <View style={styles.ticketContainer}>
          {data.isOverdue && <OverdueBar />}
          <NPSAndTicketRow ticketId={data.id} />
          {/* {getTicketID()} */}
          <NameANdDateRow
            name={
              !StringUtils.isEmpty(data?.panelMember?.name)
                ? data?.panelMember?.name
                : data.panelMember?.email
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
