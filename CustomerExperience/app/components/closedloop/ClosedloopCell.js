import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import moment from 'moment';
import {
  HalfMonthDateYearFormat,
  DMY_AT_TIME__SHORT_FORMAT,
} from '../../Utils/AppConstants';
import {
  Avatar,
  CheckBoxItem,
  ExclaimationIcon,
  PriorityUI,
  StatusUI,
} from '../../routes/commonUI/CommonUI';
import ListItemSeparator from '../../routes/commonUI/ListItemSeparator';
import StringUtils from '../../Utils/StringUtils';
import {useSelector} from 'react-redux';
import {translate} from '../../Utils/MultilinguaUtils';
import {baseTextStyles} from '../../styles/text.styles';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import AssigneeUI from './takeaction/closedLoopCell/AssigneeUI';
import {VerticalSpaceBox} from '../../widgets/SpaceBox';
import OverdueBar from './takeaction/closedLoopCell/OverdueBar';
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

const Date = ({issueDate}) => {
  const date = moment(issueDate).format(HalfMonthDateYearFormat);
  return (
    <TextLabel
      baseTextStyle={baseTextStyles.semiSecondaryRegularText}
      color={Colors.evenDarkerGrey}
      text={`${date ?? ''}`}
    />
  );
};

const NameAndDateRow = ({name, issueDate}) => {
  return (
    <View style={styles.nameAndDateContainer}>
      <TextLabel
        numberOfLines={1}
        text={name}
        baseTextStyle={baseTextStyles.primaryMediumText}
        color={Colors.accent}
        style={{maxWidth: '70%'}}
      />
      <Date issueDate={issueDate} />
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
    <TextLabel
      baseTextStyle={baseTextStyles.primaryRegularText}
      color={textColor}
    />
  );
};

const TicketNPSScore = ({nps}) => {
  return nps === null ? (
    <View />
  ) : (
    <View style={styles.npsContainer}>
      <GetNPSScore score={nps} />
      <NPSIcon />
    </View>
  );
};
const TicketIdAndAssigneeRow = ({data}) => {
  const {id, isOverdue, assignToId} = data;
  return (
    <View style={styles.ticketIdContainer}>
      <TextLabel
        text={`#${id}`}
        baseTextStyle={baseTextStyles.primaryRegularText}
        color={Colors.accentLight}
      />
      <AssigneeUI assignToId={assignToId} />
      {/* {isOverdue ? <OverdueAlert /> : <View />} */}
    </View>
  );
};

const TicketDetails = ({comment}) => {
  return (
    <View style={styles.ticketDetailsContainer}>
      <Text style={styles.detailsText} numberOfLines={3} ellipsizeMode="tail">
        {comment}
      </Text>
    </View>
  );
};

const StatusRow = ({data}) => {
  const {status, priority, npsScore} = data;

  const style_ = StyleSheet.create({
    priorityStyle: {
      flex: 1,
      justifyContent: npsScore !== null ? 'center' : 'flex-end',
    },
  });
  return (
    <View style={styles.statusContainer}>
      <StatusUI
        style={{marginStart: MarginConstants.halfTab}}
        status={status}
      />
      <PriorityUI style={style_.priorityStyle} priority={priority} />
      <TicketNPSScore nps={npsScore} />
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
      testID="closedloop-cell"
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
            testID="checkbox"
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
          <VerticalSpaceBox />
          <StatusRow data={data} />
          <VerticalSpaceBox />
          <ListItemSeparator
            style={{marginHorizontal: MarginConstants.tab1_2x}}
          />
          <VerticalSpaceBox multiplyBy={2} />
          <NameAndDateRow
            name={name}
            issueDate={data?.issueDate}
            nps={data?.npsScore}
          />

          <TicketDetails comment={data?.comment} />
          <VerticalSpaceBox multiplyBy={2} />
          <TicketIdAndAssigneeRow data={data} />
          <VerticalSpaceBox />
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
  ticketDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1_2x,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
  },
  nameAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingBottom: PaddingConstants.halfTab,
  },
  npsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
    marginEnd: MarginConstants.halfTab,
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
    paddingHorizontal: PaddingConstants.tab1_2x,
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
    paddingHorizontal: PaddingConstants.tab1,
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
  ticketDateText: {
    ...baseTextStyles.semiSecondaryRegularText,
    color: Colors.evenDarkerGrey,
  },

  detailsText: {
    ...baseTextStyles.semiSecondaryRegularText,
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
    marginHorizontal: MarginConstants.halfTab,
  },
  npsText: {
    ...baseTextStyles.primaryRegularText,
    marginHorizontal: MarginConstants.halfTab,
  },
});
