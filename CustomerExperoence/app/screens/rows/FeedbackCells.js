import React, {Component} from 'react';
import {
  View,
  Image,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
    Text
} from 'react-native';
import {StyleSheet} from 'react-native';

import ThreeDot from '../../Utils/ThreeDots';
import StringUtils from '../../Utils/StringUtils';
import ArrayUtils from '../../widgets/ArrayUtils";


const ProgressColor = {
  5: '#ff0101',
  1: '#ff7058',
  0: '#9b9b9b',
  2: '#7dc855',
};

class FeedbackCell extends Component {
  _cellTap = () => {
    this.props.onSelect();
  };

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const disable = this.props.origin === 'Detail';
    const bgColor = this.getScoreColor(item.sentiment);
    const selected = this.props.selected;
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
            {backgroundColor: selected ? 'rgba(0, 0, 0, 0.18)' : 'transparent'},
            index === 0 ? {marginTop: 10} : {},
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
              <View style={{flex: 0.6}}>
                <Text style={[styles.textLarge, styles.grayText]}>
                  {item.businessUnitName}
                </Text>
              </View>
              {this.getTicketStatusView(item)}
            </View>
            <View style={styles.lowerContent}>
              <View style={{flex: 0.6}}>
                <Text style={[styles.textLarge, styles.blueText]}>
                  {userName}
                </Text>
                {!disable && (
                  <Text style={[styles.textMedium, styles.grayText]}>
                    {textResult}
                  </Text>
                )}
                <Text style={[styles.textMedium, styles.grayText]}>
                  {item.surveyTakenDate}
                </Text>
              </View>
              {!disable && (
                <Image
                  style={styles.rightIcon}
                  source={_getImageUri('right_arrow_grey.png')}
                />
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
      return '#ff0047';
    } else if (sentiment === 'Passive') {
      return '#E3CA14';
    } else {
      return '#63A523';
    }
  };
}

const _getImageUri = src => {
  if (Platform.OS === 'android') {
    return {uri: `asset:/${src}`};
  }

  return {uri: src};
};



const styles = StyleSheet.create({
    cell: {
        marginBottom: 8,
        flexDirection: 'row'
    },
    score: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    rightContent: {
        flex: 1,
        flexDirection: 'column'
    },
    upperContent: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(205, 205, 205, 0.2)'
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusImage: {
        width: 12,
        height: 12,
        marginLeft: 4
    },
    lowerContent: {
        paddingLeft: 8,
        paddingVertical: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(205, 205, 205, 0.4)',
    },
    rightIcon: {
        width: 32,
        height: 32
    },
    separator: {
        flex: 1,
        height: 2,
        backgroundColor: 'gray'
    },
    textSmall: {
        fontSize: 10
    },
    textMedium: {
        fontSize: 12
    },
    textLarge: {
        fontSize: 14
    },
    textExtraLarge: {
        fontSize: 22
    },
    grayText: {
        color: '#9b9b9b'
    },
    whiteText: {
        color: 'white'
    },
    boldText: {
        fontWeight: 'bold'
    },
    blueText: {
        color: 'rgb(29, 119, 186)'
    }
})
export default FeedbackCell;
