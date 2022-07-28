import React, {useEffect, useState} from 'react';
import {View, TouchableWithoutFeedback, Text, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import StringUtils from '../../Utils/StringUtils';
import ArrayUtils from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import moment from 'moment';
import {translate} from '../../Utils/MultilinguaUtils';
export default function FeedbackCell(props) {
  let disable = props.origin === 'Detail';

  let [feedbackTapped, setTapped] = useState(false);
  //let surveyTakenDate = moment(props.item.surveyTakenDate).fromNow();
  let surveyTakenDate = props.item.surveyTakenDate;

  useEffect(() => {
    if (feedbackTapped) {
      setTapped(false);
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

  let renderTopSegmentView = () => {
    let status = getTicketStatus();
    return (
      <View style={styles.topSegmentContainer}>
        <Text style={styles.segmentText}>{props.item.businessUnitName}</Text>
        <Text style={styles.segmentText}>{status}</Text>
      </View>
    );
  };

  let getNPSColor = () => {
    switch (props.item.sentiment) {
      case 'Detractor':
        return Colors.detractor2;
      case 'Passive':
        return Colors.passive2;
      default:
        return Colors.promoter2;
    }
  };

  //   let renderNPSView = () => {
  //     let color = getNPSColor();
  //     return (
  //       <View style={[styles.npsContainer, {backgroundColor: color}]}>
  //         <Text
  //           style={[
  //             styles.npsText,
  //             {
  //               color:
  //                 props.item.sentiment === 'Passive'
  //                   ? Colors.primary
  //                   : Colors.white,
  //             },
  //           ]}>
  //           {props.item.answerText}
  //         </Text>
  //       </View>
  //     );
  //   };

  let getNPSIcon = () => {
    let icon;
    switch (props.item.sentiment) {
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

    return <Image source={icon} style={{width: 24, height: 24}} />;
  };

  let renderRespondentDetails = () => {
    const userName =
      (props.item.firstName ? props.item.firstName + ' ' : '') +
      '' +
      (props.item.lastName ? props.item.lastName : '');
    const email = StringUtils.isNotEmpty(props.item.textResultValue)
      ? props.item.textResultValue
      : props.item.emailAddress;
    return (
      <View style={styles.respondentContainer}>
        <Text style={styles.titleText}>{userName}</Text>
        <Text style={styles.subtitleText} numberOfLines={3}>
          {email}
        </Text>
        <Text style={styles.subtitleText}>{surveyTakenDate}</Text>
      </View>
    );
  };

  let renderCreateOrViewTicket = () => {
    let status = getTicketStatus();
    return StringUtils.isEmpty(status) ? (
      <TouchableWithoutFeedback
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          props.navigation.navigate(translate('responses.new_ticket'), {
            parentRoute: translate('responses.responses'),
          });
        }}>
        <Text style={styles.viewTicketsText}>
          {' '}
          {translate('responses.create_ticket')}
        </Text>
      </TouchableWithoutFeedback>
    ) : (
      <TouchableWithoutFeedback
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          setTapped(true);
        }}>
        <Text style={styles.viewTicketsText}>
          {translate('responses.view_ticket')}
        </Text>
      </TouchableWithoutFeedback>
    );
  };

  let renderResponseContainer = () => {
    let flag = props.parentRoute === translate('responses.responses');
    return (
      <View style={styles.responseContainer}>
        {/* {renderNPSView()} */}
        {getNPSIcon()}
        {renderRespondentDetails()}
        {!disable && (
          <Icon
            name="arrow-right"
            size={Sizes.icons}
            color={Colors.secondary}
          />
        )}
        {disable && flag && renderCreateOrViewTicket()}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onSelect();
      }}
      disabled={disable}>
      <View style={styles.container}>
        {renderTopSegmentView()}
        {renderResponseContainer()}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: MarginConstants.tab1,
    padding: PaddingConstants.halfTab,
    backgroundColor: Colors.white,
  },
  topSegmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
  },
  segmentText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  responseContainer: {
    flexDirection: 'row',
    padding: PaddingConstants.tab1,
    alignItems: 'center',
  },
  npsText: {
    fontSize: TextSizes.largeText,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  npsContainer: {
    borderRadius: MarginConstants.tab4,
    width: 1.2 * MarginConstants.tab4,
    height: 1.2 * MarginConstants.tab4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: PaddingConstants.tab1,
  },
  respondentContainer: {
    paddingHorizontal: PaddingConstants.tab2,
    flex: 1,
  },
  titleText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    textAlign: 'left',
    fontFamily: FontFamily.semiBold,
    marginVertical: MarginConstants.halfTab / 2,
    paddingBottom: 2,
  },
  subtitleText: {
    color: Colors.secondary,
    fontSize: TextSizes.secondary,
    textAlign: 'left',
    fontFamily: FontFamily.regular,
    marginVertical: MarginConstants.halfTab / 2,
    paddingBottom: 2,
  },
  viewTicketsText: {
    color: Colors.accent,
    fontSize: TextSizes.secondary,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
  },
});
