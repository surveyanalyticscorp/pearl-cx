import React, {useEffect, useState} from 'react';
import {View, TouchableWithoutFeedback, Text, Platform} from 'react-native';
import {StyleSheet} from 'react-native';
import StringUtils from '../../../Utils/StringUtils';
import ArrayUtils from '../../../Utils/ArrayUtils';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../../styles/font.constants';
import {translate} from '../../../Utils/MultilinguaUtils';
import NPSIcon from '../../../widgets/NPSIcon';
import NPSAnswerText from '../../../widgets/NPSAnswerText';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {
  ASYNC_RESPONSES_WITH_CX_MANAGER,
  RESPONSE_READ_UNREAD_FEATURE_ACTIVATION_DATE,
} from '../../../api/Constant';
import {useSelector} from 'react-redux';
import moment from 'moment';
import AsyncStorageData from '../../../Utils/AsyncUtil';
import NewResponseDot from './NewResponseDot';

function showName(item) {
  let name = `${item.firstName ?? ''} ${item.lastName ?? ''}`;
  let email = item.emailAddress ?? '';
  if (!StringUtils.isEmpty(name.trim())) {
    return name.trim();
  } else if (!StringUtils.isEmpty(email.trim())) {
    return email;
  } else {
    return translate('ticket_list.anonymous');
  }
}

const UserName = ({isNewResponse, name, isDisabled}) => {
  const charLength = 24;
  const shortenedString =
    name && name.length > charLength
      ? name.slice(0, charLength) + '...' // If longer than 12 characters, slice and add ellipsis
      : name;

  const fontWeight = isNewResponse
    ? Platform.OS === 'ios'
      ? FontWeight._700
      : FontWeight._900
    : Platform.OS === 'ios'
    ? FontWeight._400
    : FontWeight._100;
  return (
    <Text
      numberOfLines={isDisabled ? 4 : 1}
      style={{
        ...styles.userNameText,

        fontWeight: fontWeight,
      }}
      testID="user-name">
      {name.length > 1
        ? isDisabled
          ? name
          : shortenedString
        : translate('ticket_list.anonymous')}
    </Text>
  );
};
const Date = ({surveyTakenDate}) => {
  return <TextLabel text={surveyTakenDate} />;
};

const ResponseId = ({responseSetID}) => {
  return (
    <View style={styles.responseIdContainer} testID="response-id">
      <TextLabel
        color={Colors.evenDarkerGrey}
        text={`${translate('close_loop.response_id')} ${responseSetID}`}
      />
    </View>
  );
};

let RenderCreateOrViewTicket = ({hasTicket, onPress}) => {
  return !hasTicket ? (
    <TouchableWithoutFeedback
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      onPress={onPress}>
      <Text style={styles.viewTicketsText}>
        {translate('responses.create_ticket')}
      </Text>
    </TouchableWithoutFeedback>
  ) : (
    <View />
  );
};

let RenderResponseContainer = ({
  item,
  parentRoute,
  origin,
  hasTicket,
  navigation,
  isNewResponse,
}) => {
  let flag = parentRoute === translate('responses.responses');
  let disable = origin === 'Detail';

  let {
    surveyTakenDate,
    emailAddress,
    answerText,
    sentiment,
    responseSetID,
    surveyID,
  } = item;

  const navigateToNewTicket = () => {
    navigation.navigate(translate('responses.new_ticket'), {
      responseId: responseSetID,
      customerName: showName(item) ?? '',
      customerEmail: emailAddress ?? '',
      surveyId: surveyID ?? '',
    });
  };
  const title = StringUtils.truncateCustomerName(showName(item), 30, 10, 8);

  return (
    <View testID="response-container" style={styles.upperContainer}>
      <View style={styles.responseContainer}>
        {/* {renderNPSView()} */}

        <View
          style={{
            ...styles.rowContainer,
            marginStart: MarginConstants.halfTab,
          }}>
          <NewResponseDot
            style={{
              marginEnd: MarginConstants.tab1,
            }}
            isNewResponse={isNewResponse}
          />
          {/* <NPSIcon sentiment={sentiment} />
          <NPSAnswerText sentiment={sentiment} answerText={answerText} /> */}
          <NPSIcon sentiment={'Promoter'} />
          <NPSAnswerText sentiment={'Promoter'} answerText={6} />
          <HorizontalSpaceBox />
          <UserName
            isNewResponse={isNewResponse}
            // name={StringUtils.truncateCustomerName(showName(item), 30, 10, 8)}
            name={title}
            isDisabled={disable}
          />
        </View>

        <View style={styles.dateAndArrowIconContainer}>
          <Date surveyTakenDate={surveyTakenDate} />
          {/* {!disable && (
            <Icon
              name="arrow-right"
              size={Sizes.icons}
              color={Colors.secondary}
            />
          )} */}
        </View>
      </View>
      <View style={styles.responseIdAndTicketRowContainer}>
        <ResponseId responseSetID={responseSetID} />
        {/* {!read && isSurveyTakenAfterJuneFirst(surveyTakenDate) && (
          <NewResponse />
        )} */}
        {disable && flag && (
          <RenderCreateOrViewTicket
            hasTicket={hasTicket}
            onPress={navigateToNewTicket}
          />
        )}
      </View>
    </View>
  );
};
const ResponseItemButton = ({
  children,
  responseSetID,
  isDisabled,
  onSelect,
  surveyTakenDate,
}) => {
  const responseReadList = useSelector(
    state => state.response.responseReadList,
  );
  const asyncSetResponseId = () => {
    console.log(
      'WWWWWW',
      surveyTakenDate,
      isSurveyTakenAfterJuneFirst(surveyTakenDate),
    );
    if (
      isSurveyTakenAfterJuneFirst(surveyTakenDate) &&
      !ArrayUtils.containsElement(responseReadList, responseSetID)
    ) {
      const storage = new AsyncStorageData(ASYNC_RESPONSES_WITH_CX_MANAGER);
      storage.setDataAsString([
        ...new Set([...responseReadList, responseSetID]),
      ]);
    }
  };

  return (
    <TouchableWithoutFeedback
      testID="feedback-cell"
      onPress={() => {
        onSelect();
        asyncSetResponseId();
      }}
      disabled={isDisabled}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default function FeedbackCell(props) {
  const {responseSetID, surveyTakenDate, read} = props.item;
  let [feedbackTapped, setTapped] = useState(false);
  let disable = props.origin === 'Detail';

  useEffect(() => {
    if (feedbackTapped) {
      setTapped(false);
      props.navigation.navigate(translate('close_loop.ticket_details'), {
        ticketID: props.item.ticketID,
        parentRoute: 'Responses',
      });
    }
  }, [feedbackTapped, props.item.ticketID, props.navigation]);
  const isNewResponse = !read && isSurveyTakenAfterJuneFirst(surveyTakenDate);

  return (
    <ResponseItemButton
      responseSetID={responseSetID}
      surveyTakenDate={surveyTakenDate}
      isDisabled={disable}
      onSelect={props.onSelect}
      testID="feedback-cell">
      <View style={styles.cellContainer}>
        {/* <RenderIsNewResponse
          read={read}
          responseSetID={responseSetID}
          surveyTakenDate={surveyTakenDate}
          disable={disable}
        /> */}
        <View style={styles.container}>
          <RenderResponseContainer
            {...props}
            isNewResponse={isNewResponse}
            testID="response-container"
          />
        </View>
      </View>
    </ResponseItemButton>
  );
}

function isSurveyTakenAfterJuneFirst(surveyTakenDate) {
  const specificDate = moment(
    RESPONSE_READ_UNREAD_FEATURE_ACTIVATION_DATE,
    'MMM DD YYYY',
  );
  const parsedDate = moment(surveyTakenDate, 'MMM DD YYYY');
  return moment(parsedDate).isAfter(specificDate);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  upperContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  cellContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
    paddingVertical: PaddingConstants.tab1_2x,
    paddingHorizontal: PaddingConstants.tab1_2x,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  responseContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  responseIdContainer: {
    flex: 1,
  },

  subtitleText: {
    color: Colors.secondary,
    fontSize: TextSizes.secondary,
    textAlign: 'left',
    fontFamily: FontFamily.regular,
    marginVertical: MarginConstants.halfTab / 2,
    paddingBottom: 2,
  },
  secondaryTitle: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontWeight: 'bold',
  },
  secondaryText: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontWeight: '900',
  },
  contactBox: {
    flexDirection: 'row',
    marginVertical: MarginConstants.halfTab,

    alignItems: 'baseline',
  },
  contactText: {
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginHorizontal: MarginConstants.tab1,
  },
  viewTicketsText: {
    backgroundColor: Colors.accentLight,
    color: Colors.white,
    fontSize: TextSizes.secondary,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    padding: 5,
    borderRadius: 2,
  },
  userNameText: {
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    color: Colors.filterIconColor,
    textAlign: 'center',
  },
  responseIdAndTicketRowContainer: {
    marginStart: MarginConstants.tab1_2x,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateAndArrowIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  unreadIndicator: {
    height: 12,
    width: 12,
    borderRadius: 25,
    marginHorizontal: MarginConstants.tab1,
  },
});
