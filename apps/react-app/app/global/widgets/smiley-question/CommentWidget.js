import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native';
import QPCard from '../card/QPCard';
import QPCardTextInput from '../card/QPCardTextInput';
import CustomText from '../../ui/CustomText';
import colorCodes from '../typography/ColorCodes';

export default class CommentWidget extends Component {

  render() {
    return (
      <View style={styles.mainContainer}>
        <QPCard title={this.props.title}>{this.getCommentBoxContainer() }</QPCard>
      </View>
    );
  }
  getButtonImage() {
          if (Platform.OS != 'ios') {
              return require('../../images/arrow_right_blue.png');
          }
          let iosImage = {uri:'arrow_right_blue.png'};
          return iosImage;
  }

  getCommentBoxContainer() {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.textInputContainer}>
          <QPCardTextInput
            onChangeText = {this.props.onCommentChange}>
          </QPCardTextInput>
        </View>
        <View style={styles.footer}>

          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={'#CCCCCC'}
            onPress={this.props.onPress}
            >
            <View style={{flexDirection: 'row'}}>
              <CustomText style={[styles.lastResponseText, colorCodes.secondaryFontColor]}>

                Next

            </CustomText>
            <Image source ={this.getButtonImage()}
            style={styles.arrowStyle}/>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
};

// CommentWidget.propTypes = {
//   onPress: React.PropTypes.func,
//   title: React.PropTypes.string,
//   totalResponses: React.PropTypes.number
// };

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15
  },
  parentContainer: {
    backgroundColor: '#f7f7f7',
    flex: 1
  },
  textInputContainer: {
    backgroundColor: 'white',
    height: 100,
    flex: 1
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'

  },

  arrowStyle: {
    height: 18,
    width: 18,
    marginLeft: 4,
    marginRight: 4
  },

  lastResponseText: {
    fontSize: 16
  }
});
