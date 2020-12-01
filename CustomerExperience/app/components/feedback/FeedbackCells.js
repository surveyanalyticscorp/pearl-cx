import React, {Component} from 'react';
import {
  View,
  Platform,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {StyleSheet} from 'react-native';
import ThreeDot from '../../Utils/ThreeDots';
import StringUtils from '../../Utils/StringUtils';
import ArrayUtils from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';

const ProgressColor = {
  5: '#ff0101',
  1: '#ff7058',
  0: '#9b9b9b',
  2: '#7dc855',
};


const FeedbackCell = (props) => {
  let disable = props.origin === 'Detail';

  let getTicketStatus = () => {
    if (props.item.ticketStatus !== -1) {
      return ArrayUtils.getMatchingObject(
          props.ticketStatuses,
          'id',
          props.item.ticketStatus,
      ).text
    }
    return ''
  };

  let renderTopSegmentView = () => {
    let status = getTicketStatus();
    return <View style={styles.topSegmentContainer}>
      <Text style={styles.segmentText}>{props.item.businessUnitName}</Text>
      <Text style={styles.segmentText}>{status}</Text>
    </View>
  };

  let getNPSColor = () => {
    switch (props.item.sentiment) {
      case 'Detractor':
        return Colors.detractor;
      case 'Passive':
        return Colors.passive;
      default:
        return Colors.promoter;
    }
  };

  let renderNPSView = () => {
    let color = getNPSColor();
    return (
        <View style={[styles.npsContainer,{backgroundColor: color}]}>
          <Text style={[styles.npsText,{color: props.item.sentiment === 'Passive' ? Colors.primary : Colors.white}]}>{props.item.answerText}</Text>
        </View>
    )
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
          <Text style={styles.subtitleText} numberOfLines={3}>{email}</Text>
          <Text style={styles.subtitleText}>{props.item.surveyTakenDate}</Text>
        </View>
    )
  };

  let renderResponseContainer = () => {
    return (
        <View style={styles.responseContainer}>
          {renderNPSView()}
          {renderRespondentDetails()}
          {!disable && <Icon name= 'arrow-right' size={Sizes.icons} color={Colors.secondary} />}
          {disable && (<TouchableWithoutFeedback hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                                                 onPress={() => {alert('navigate to ticket')}}
              >
            <Text style={styles.viewTicketsText}> View Ticket</Text>
              </TouchableWithoutFeedback>
            )}
        </View>
    )
  };

return (
    <TouchableWithoutFeedback onPress={props.onSelect} disabled={disable}>
    <View style={styles.container}>
      {renderTopSegmentView()}
      {renderResponseContainer()}
    </View>
    </TouchableWithoutFeedback>
)
};

const styles = StyleSheet.create({
  container:{
    margin: MarginConstants.tab1,
    padding: PaddingConstants.halfTab,
    backgroundColor: Colors.white
  },
  topSegmentContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1
  },
  segmentText: {
   color: Colors.primary,
   fontSize: TextSizes.secondary,
   fontFamily: FontFamily.regular,
   textAlign: 'center'
  },
  responseContainer: {
    flexDirection: 'row',
    padding: PaddingConstants.tab1,
    alignItems: 'center',
  },
  npsText: {
    fontSize: TextSizes.extraLargeText,
    fontFamily: FontFamily.regular,
    textAlign:'center',
  },
  npsContainer: {
    borderRadius: MarginConstants.tab4,
    width: 1.2*MarginConstants.tab4,
    height: 1.2*MarginConstants.tab4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: PaddingConstants.tab1
  },
  respondentContainer: {
    paddingHorizontal: PaddingConstants.tab2,
    flex:1
  },
  titleText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    textAlign: 'left',
    fontFamily: FontFamily.semiBold,
    marginVertical: MarginConstants.halfTab/2
  },
  subtitleText: {
    color: Colors.secondary,
    fontSize: TextSizes.secondary,
    textAlign: 'left',
    fontFamily: FontFamily.regular,
    marginVertical: MarginConstants.halfTab/2
  },
  viewTicketsText: {
    color: Colors.accent,
    fontSize: TextSizes.secondary,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
  },

});

/**
class FeedbackCell extends Component {
  _cellTap = () => {
    this.props.onSelect();
  };

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const disable = this.props.origin === 'Detail';
    const bgColor = this.getScoreColor(item.sentiment);
    const textResult = StringUtils.isNotEmpty(item.textResultValue)
      ? item.textResultValue
      : item.emailAddress;
    const userName =
      (item.firstName ? item.firstName + ' ' : '') +
      '' +
      (item.lastName ? item.lastName : '');
    return (
      <TouchableHighlight
        onPress={this._cellTap}
        disabled={disable}
        underlayColor={'rgba(0, 0, 0, 0)'}>
        <View
          style={[
            styles.cell,
            {marginTop: index === 0 ? MarginConstants.halfTab : 0},
          ]}>
          <View style={[styles.score, {backgroundColor: bgColor}]}>
            <Text
              style={[
                styles.textExtraLarge,
                styles.whiteText,
                styles.boldText,
              ]}>
              {item.answerText}
            </Text>
          </View>
          <View style={styles.rightContent}>
            <View style={styles.upperContent}>
              <View style={{flex: 1}}>
                <Text style={[styles.textLarge, styles.grayText]}>
                  {item.businessUnitName}
                </Text>
              </View>
              {this.getTicketStatusView(item)}
            </View>
            <View style={styles.lowerContent}>
              <View style={{flex: 1,marginRight:MarginConstants.tab1}}>
                {StringUtils.isNotEmpty(userName) && <Text style={[styles.textLarge, styles.blueText]}>
                  {userName}
                </Text>}
                {!disable && (
                  <Text style={[styles.textMedium, styles.grayText,{marginVertical:MarginConstants.halfTab}]}>
                    {textResult}
                  </Text>
                )}
                <Text style={[styles.textMedium, styles.grayText]}>
                  {item.surveyTakenDate}
                </Text>
              </View>
              {!disable && (
                <Icon name="keyboard-arrow-right" size={32} color="grey" />
              )}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  getTicketStatusView(item) {
    if (item.ticketStatus !== -1) {
      const {ticketStatuses} = this.props;
      return (
        <TouchableOpacity
          activeOpacity={this.props.onPressStatus ? 0.8 : 1}
          onPress={() => {
            this.props.onSelect && this.props.onSelect();
          }}>
          <View style={styles.status}>
            <Text style={[styles.textSmall, styles.grayText]}>
              {
                ArrayUtils.getMatchingObject(
                  ticketStatuses,
                  'id',
                  item.ticketStatus,
                ).text
              }
            </Text>
            <ThreeDot color={ProgressColor[item.ticketStatus]} />
          </View>
        </TouchableOpacity>
      );
    }
  }

  getScoreColor = sentiment => {
    if (sentiment === 'Detractor') {
      return Colors.detractor;
    } else if (sentiment === 'Passive') {
      return Colors.passive;
    } else {
      return Colors.promoter;
    }
  };
}

 */

// const styles = StyleSheet.create({
//   cell: {
//     marginBottom: 8,
//     flexDirection: 'row',
//   },
//   score: {
//     width: 40,
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },
//   rightContent: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   upperContent: {
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: Colors.grey,
//   },
//   status: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusImage: {
//     width: 12,
//     height: 12,
//     marginLeft: 4,
//   },
//   lowerContent: {
//     paddingLeft: 8,
//     paddingVertical: 8,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: Colors.white,
//   },
//   rightIcon: {
//     width: 32,
//     height: 32,
//   },
//   separator: {
//     flex: 1,
//     height: 2,
//     backgroundColor: 'gray',
//   },
//   textSmall: {
//     fontSize: 10,
//   },
//   textMedium: {
//     fontSize: 12,
//   },
//   textLarge: {
//     fontSize: 14,
//   },
//   textExtraLarge: {
//     fontSize: 22,
//   },
//   grayText: {
//     color: Colors.secondary,
//   },
//   whiteText: {
//     color: Colors.white,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   blueText: {
//     color: Colors.primary,
//   },
// });
export default FeedbackCell;
