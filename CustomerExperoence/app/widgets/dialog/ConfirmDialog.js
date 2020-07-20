import React, {Component} from 'react';
import {Platform, Text, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

import Dialog from './Dialog';
import TouchableEffect from './TouchableEffect';
import {Colors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';

const {OS} = Platform;

const DEFAULT_COLOR_BUTTON = '#0000FF99';
const DEFAULT_BACKGROUNDCOLOR_BUTTON = 'transparent';

class ConfirmDialog extends Component {
  getButtonStyle = (button, positive) => {
    const {disabled} = button;
    const style = button.style || {};
    const {backgroundColor, backgroundColorDisabled, ...othersStyle} = style;
    return Platform.select({
      ios: {
        height: 46,
        justifyContent: 'center',
        backgroundColor:
          (!disabled
            ? backgroundColor
            : backgroundColorDisabled || backgroundColor) ||
          DEFAULT_BACKGROUNDCOLOR_BUTTON,
        ...othersStyle,
      },
      android: {
        backgroundColor:
          (!disabled
            ? backgroundColor
            : backgroundColorDisabled || backgroundColor) ||
          DEFAULT_BACKGROUNDCOLOR_BUTTON,
        ...othersStyle,
      },
    });
  };

  getButtonTextStyle = (button, positive) => {
    const {disabled} = button;
    const titleStyle = button.titleStyle || {};
    const {color, colorDisabled, ...othersStyle} = titleStyle;
    return Platform.select({
      ios: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color:
          (!disabled ? color : colorDisabled || color) || DEFAULT_COLOR_BUTTON,
        fontWeight: positive ? 'bold' : 'normal',
        ...othersStyle,
      },
      android: {
        height: 36,
        minWidth: 70,
        padding: 8,
        textAlign: 'center',
        textAlignVertical: 'center',
        color:
          (!disabled ? color : colorDisabled || color) || DEFAULT_COLOR_BUTTON,
        fontWeight: 'bold',
        ...othersStyle,
      },
    });
  };

  renderMessage() {
    const {message, messageStyle} = this.props;

    const textAlign = OS === 'ios' ? 'center' : null;

    if (message) {
      return (
        <Text
          style={[
            {textAlign, color: Colors.secondary, fontSize: TextSizes.secondary},
            messageStyle,
          ]}>
          {message}
        </Text>
      );
    }
  }

  renderButton(button, positive) {
    if (button && button.title) {
      const {onPress, disabled, color} = button;
      const title =
        OS === 'ios'
          ? button.title
          : button.title === undefined
          ? button.title
          : button.title.toUpperCase();

      const containerStyle = this.getButtonStyle(button, positive);

      const textStyle = this.getButtonTextStyle(button, positive);

      const touchableStyle = OS === 'ios' ? {flex: 1} : {};

      return (
        <TouchableEffect
          onPress={onPress}
          disabled={disabled}
          style={touchableStyle}>
          <View style={containerStyle}>
            <Text style={textStyle}>{title}</Text>
          </View>
        </TouchableEffect>
      );
    }
  }

  renderButtons() {
    const {negativeButton, positiveButton, flexDirection} = this.props;

    const containerStyle =
      OS === 'ios'
        ? {flexDirection: flexDirection || 'row'}
        : {
            flexDirection: flexDirection || 'row',
            justifyContent: 'flex-end',
            height: 36,
          };

    const dividerVertStyle =
      OS === 'ios'
        ? {width: negativeButton ? 1 : 0, backgroundColor: '#00000011'}
        : {width: 8};

    const dividerHoriStyle =
      OS === 'ios' ? {height: 1, backgroundColor: '#00000011'} : {height: 0};

    return (
      <View>
        <View style={dividerHoriStyle} />
        <View style={containerStyle}>
          {this.renderButton(negativeButton, false)}
          <View style={dividerVertStyle} />
          {this.renderButton(positiveButton, true)}
        </View>
      </View>
    );
  }

  renderContent() {
    const {children} = this.props;

    if (children) {
      return children;
    } else {
      return this.renderMessage();
    }
  }

  render() {
    return (
      <Dialog {...this.props} buttons={this.renderButtons()}>
        {this.renderContent()}
      </Dialog>
    );
  }
}

const buttonPropType = PropTypes.shape({
  title: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  titleStyle: PropTypes.shape({
    ...Text.propTypes.style,
    colorDisabled: PropTypes.string,
  }),
  style: PropTypes.shape({
    ...ViewPropTypes.style,
    backgroundColorDisabled: PropTypes.string,
  }),
});

ConfirmDialog.propTypes = {
  ...Dialog.propTypes,
  message: PropTypes.string,
  messageStyle: Text.propTypes.style,
  negativeButton: buttonPropType,
  positiveButton: buttonPropType,
};

export default ConfirmDialog;
