import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, ViewPropTypes, Text, View} from 'react-native';

import Dialog from './Dialog';
import {styles} from './style';

class ProgressDialog extends Component {
  render() {
    const {
      message,
      messageStyle,
      activityIndicatorColor,
      activityIndicatorSize,
      activityIndicatorStyle,
      isRTL,
    } = this.props;

    return (
      <Dialog {...this.props}>
        <View
          style={[
            styles.loadingView,
            {flexDirection: isRTL ? 'row-reverse' : 'row'},
          ]}>
          <ActivityIndicator
            animating={true}
            color={activityIndicatorColor}
            size={activityIndicatorSize}
            style={activityIndicatorStyle}
          />
          <Text
            style={[
              styles.defaultLoadingText,
              messageStyle,
              {textAlign: isRTL ? 'right' : 'left'},
            ]}>
            {message}
          </Text>
        </View>
      </Dialog>
    );
  }
}

ProgressDialog.propTypes = {
  ...Dialog.propTypes,
  message: PropTypes.string.isRequired,
  messageStyle: Text.propTypes.style,
  //activityIndicatorColor: ViewPropTypes.color,
  //activityIndicatorSize: ViewPropTypes.size,
  //activityIndicatorStyle: ViewPropTypes.style
};

delete ProgressDialog.propTypes.children;

export default ProgressDialog;
