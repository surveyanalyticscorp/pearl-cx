import React, {useEffect, useState} from 'react';
import {View, TouchableWithoutFeedback, Pressable, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import StringUtils from '../../Utils/StringUtils';
import ArrayUtils from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import {translate} from '../../Utils/MultilinguaUtils';
import NPSIcon from '../../widgets/NPSIcon';
import NPSAnswerText from '../../widgets/NPSAnswerText';
import {HorizontalSpaceBox, VerticalSpaceBox} from '../../widgets/SpaceBox';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../styles/text.styles';
// import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
// import {backgroundColor} from '../../widgets/qp-calendar/style';
// import style from '../../widgets/qp-calendar/calendar/header/style';
export default function FeedbackCell(props) {
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
  let disable = props.origin === 'Detail';
  let hasTicket = props.hasTicket;
  const name = showName(props.item);
  const email = props.item.emailAddress ?? '';
  const surveyID = props.item.surveyID;
  let [isNewResponse, setNewResponse] = useState(
    props.item.ticketStatus === -1,
  );

  let [feedbackTapped, setTapped] = useState(false);
  let surveyTakenDate = props.item.surveyTakenDate;

  useEffect(() => {
    if (feedbackTapped) {
      setTapped(false);
      console.log('feedback tapped');
      props.navigation.navigate(translate('close_loop.ticket_details'), {
        ticketID: props.item.ticketID,
        parentRoute: 'Responses',
      });
    }
  }, [feedbackTapped]);

  let getTicketStatus = () => {
    if (props.item.ticketStatus !== -1) {
      return ArrayUtils.getMatchingObject(
        props.ticketStatuses,
        'id',
        props.item.ticketStatus,
      ).text;
    }
    return '';
  };

  let UserName = ({name, isDisabled}) => {
    const charLength = 24;
    const shortenedString =
      name && name.length > charLength
        ? name.slice(0, charLength) + '...' // If longer than 12 characters, slice and add ellipsis
        : name;
    return (
      <Text
        numberOfLines={isDisabled ? 4 : 1}
        style={[styles.userNameText, {maxWidth: '90%'}]}>
        {name.length > 1
          ? isDisabled
            ? name
            : shortenedString
          : translate('ticket_list.anonymous')}
      </Text>
    );
  };

  let Date = ({surveyTakenDate}) => {
    return (
      <TextLabel
        text={surveyTakenDate}
        baseTextStyle={baseTextStyles.semiSecondaryRegularText}
        color={Colors.evenDarkerGrey}
      />
    );
  };

  let ResponseId = ({responseSetID}) => {
    return (
      <View style={styles.responseIdContainer}>
        <TextLabel
          style={{marginHorizontal: 0}}
          text={`${translate('close_loop.response_id')} ${responseSetID}`}
        />
      </View>
    );
  };

  const RenderIsNewResponse = () => {
    let color = isNewResponse ? Colors.accentLight : Colors.fullTransparent;
    return (
      !disable && (
        <View style={[styles.unreadIndicator, {backgroundColor: color}]} />
      )
    );
  };

  let renderCreateOrViewTicket = () => {
    return !hasTicket ? (
      <TouchableWithoutFeedback
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          props.navigation.navigate(translate('responses.new_ticket'), {
            responseId: props.item.responseSetID,
            customerName: name,
            customerEmail: email,
            surveyId: surveyID,
          });
        }}>
        <Text style={styles.viewTicketsText}>
          {translate('responses.create_ticket')}
        </Text>
      </TouchableWithoutFeedback>
    ) : (
      <View />
    );
  };
  const RenderContactDetails = () => {
    return (
      <View style={{marginVertical: MarginConstants.tab2}}>
        <Text style={styles.secondaryTitle}>Contact Information</Text>
        <RenderPhoneNumber />
        <RenderEmailAddress />
      </View>
    );
  };

  const RenderPhoneNumber = () => {
    let phoneNumber = props.item.phone ?? '';
    return phoneNumber.length ? (
      <Pressable
        onPress={() => {
          console.log('Phone Number');
        }}
        style={styles.contactBox}>
        <IonIcon name="call" size={12} color={Colors.filterIconColor} />
        <Text style={styles.contactText}>{phoneNumber}</Text>
      </Pressable>
    ) : (
      <View />
    );
  };

  const RenderEmailAddress = () => {
    return email.length ? (
      <Pressable
        onPress={() => {
          console.log('Email Address');
        }}
        style={styles.contactBox}>
        <IonIcon name="mail" size={14} color={Colors.filterIconColor} />
        <Text style={styles.contactText}>{email}</Text>
      </Pressable>
    ) : (
      <View />
    );
  };

  const RenderDateDetails = () => {
    let date = props.item.surveyTakenDate ?? '';

    return (
      <View style={{marginVertical: MarginConstants.tab1}}>
        <Text style={styles.secondaryTitle}>{translate('responses.date')}</Text>
        <Text style={styles.secondaryText}>{date}</Text>
      </View>
    );
  };

  let renderResponseContainer = () => {
    let flag = props.parentRoute === translate('responses.responses');
    return (
      <View style={styles.upperContainer}>
        <View style={styles.responseContainer}>
          {/* {renderNPSView()} */}

          <View style={[styles.rowContainer, {maxWidth: '70%'}]}>
            <NPSIcon sentiment={props.item.sentiment} />
            <HorizontalSpaceBox />
            <NPSAnswerText
              sentiment={props.item.sentiment}
              answerText={props.item.answerText}
            />
            <HorizontalSpaceBox />
            <UserName name={name} isDisabled={disable} />
          </View>

          <View style={styles.dateAndArrowIconContainer}>
            <Date surveyTakenDate={surveyTakenDate} />
            {!disable && (
              <Icon
                name="arrow-right"
                size={Sizes.icons}
                color={Colors.secondary}
              />
            )}
          </View>
        </View>
        <VerticalSpaceBox multiplyBy={2} />
        <View style={styles.responseIdAndTicketRowContainer}>
          <ResponseId responseSetID={props.item.responseSetID} />
          {disable && flag && renderCreateOrViewTicket()}
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onSelect();
      }}
      disabled={disable}>
      <View style={styles.rowContainer}>
        <RenderIsNewResponse />
        <View style={styles.container}>{renderResponseContainer()}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: MarginConstants.tab1,
    padding: PaddingConstants.tab1_2x,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.evenDarkerGrey,
  },
  upperContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
    textAlign: 'center',
  },
  responseIdAndTicketRowContainer: {
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
