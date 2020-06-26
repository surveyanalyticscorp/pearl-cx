import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';
import QPCard from './card/QPCard';
import CustomText from '../ui/CustomText';
import colorCodes from './typography/ColorCodes';

export default class SurveyItemWidget extends Component {

  render() {
    return (
      <View style={styles.mainContainer}>
        <QPCard title={this.props.title} onPress={this.props.onPress}>
          {this.getSurveyContent()}
        </QPCard>
      </View>
    );

  }

  getSurveyContent() {
    return (
      <View style={styles.contentParent}>
        <View style={styles.emailContainer}>
          <View style={styles.dummyView}></View>
          <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={[styles.lastResponseText, colorCodes.secondaryFontColor]}>
            {this.props.lastResponseText}
          </CustomText>
        </View>
        <View style={styles.responseContainer}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>

            {this.getTrimmedNoOfResponses()}

            <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={[styles.ResponseText, colorCodes.primaryFontColor]}>
              {this.getResponseText()}
            </CustomText>
          </View>
        </View>
      </View>
    );
  }

  getTrimmedNoOfResponses() {
    let numberOfResponsesNumber = this.props.noOfResponses;
    let numberOfResponses = numberOfResponsesNumber+"";
    
    if (numberOfResponsesNumber >= 10000) {
      numberOfResponses = Math.round(numberOfResponsesNumber / 1000).toFixed(numberOfResponsesNumber>10000? 0:1) + "K";
    }
    else if(numberOfResponsesNumber >= 1000){
      numberOfResponses = (numberOfResponsesNumber / 1000).toFixed(1) + "K";
    }

    let textView = (<CustomText numberOfLines={1} ellipsizeMode={'tail'} style={[styles.bigNumber, colorCodes.primaryFontColor]}>{numberOfResponses}</CustomText>);
    return textView;

  }

  getEllipsizeDots(trimmingNeeded) {
    if (trimmingNeeded) {
      return (<CustomText style={[{ fontSize: 20, fontWeight: 'bold' }, colorCodes.primaryFontColor]}>K+</CustomText>);
    }
  }

  getResponseText() {
    return this.props.noOfResponses > 1 ? 'Responses' : 'Response';
  }
}


// SurveyItemWidget.propTypes = {
//   onPress: React.PropTypes.func,
//   title: React.PropTypes.string,
//   noOfResponses: React.PropTypes.number,
//   lastResponseText: React.PropTypes.string
// };

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15
  },
  contentParent: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15

  },
  emailContainer: {
    flex: 3,
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  responseContainer: {
    flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  lastResponseText: {
    flex: 1,
    fontSize: 12
  },
  ResponseText: {
    flex: 1,
    fontSize: 12
  },
  dummyView: {
    flex: 5
  },
  bigNumber: {
    flex: 5,
    fontWeight: 'bold',
    fontSize: 70,
    paddingBottom: -10,
    justifyContent: 'flex-end'

  }
});
