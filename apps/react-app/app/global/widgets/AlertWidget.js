import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  TouchableHighlight,
  Dimensions,
  AsyncStorage
} from 'react-native';

import Button from 'react-native-button';
import QPCard from '../widgets/card/QPCard';
import QPCardTextInput from '../widgets/card/QPCardTextInput';
import CustomText from '../ui/CustomText';
import colorCodes from '../widgets/typography/ColorCodes';
import Font from './typography/Font.js'

const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;

export default class AlertWidget extends Component {

  render() {
    return (
      <View style={styles.alertContainer}>
        <View style={styles.titleContainer} >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <CustomText style={styles.titleText} numberOfLines={1} ellipsizeMode='tail'>
              {this.props.titleText}
            </CustomText>
          </View>
          <View style={{justifyContent: 'center', marginHorizontal:10 }}>
            <TouchableHighlight activeOpacity={0.6} onPress={this.props.onPress}>
              <Image style={{ width: 10, height: 10 }} source={this.getCloseButtonImage()} />
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.messageContainer} >
          <CustomText style={styles.messageText} numberOfLines={8} ellipsizeMode='tail'>
            {this.props.messageText}
          </CustomText>
        </View>
      </View>
    );
  }

  getCloseButtonImage() {
    if (Platform.OS != 'ios') {
      return require('../images/communities/close_icon.png');
    }
    let iosImage = { uri: 'close_icon.png' };
    return iosImage;
  }

};

// AlertWidget.propTypes = {
//   onPress: React.PropTypes.func,
//   titleText: React.PropTypes.string,
//   messageText: React.PropTypes.string
// };

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: '#ECD3D7',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15
  },
  titleContainer: {
    backgroundColor: '#E26173',
    height: Math.round(factor * 0.09),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#C74D5E'
  },
  titleText: {
    color: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 10,
    fontWeight: 'normal',
    fontSize: global.h3FontSize,
    fontFamily: global.primaryText
  },
  messageText: {
    color: '#3b444b',
    justifyContent: 'center',

    fontSize: global.h3FontSize,
    fontFamily: global.primaryText
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 36,
    margin: 1
  }

});
