import React, {Component} from 'react';
import {Platform, Text, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

import Dialog from './Dialog';
import TouchableEffect from './TouchableEffect';
import Picker from '@gregfrench/react-native-wheel-picker';

const {OS} = Platform;

const DEFAULT_COLOR_BUTTON = '#0000FF99';
const DEFAULT_BACKGROUNDCOLOR_BUTTON = 'transparent';
let PickerItem = Picker.Item;

class LanguagePickerDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedItem: props.selectedItem};
  }

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
        minWidth: 64,
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

  onPickerSelect(index) {
    this.setState({
      selectedItem: index,
    });
  }

  renderLanguagePicker() {
    const {itemList} = this.props;

    return (
      <Picker
        style={{width: 200, height: 250}}
        selectedValue={this.props.selectedItem}
        itemStyle={{color: 'black', fontSize: 21}}
        onValueChange={index => this.onPickerSelect(index)}>
        {itemList.map((value, i) => (
          <PickerItem label={value} value={i} key={'money' + value} />
        ))}
      </Picker>
    );
  }

  renderButton(button, positive) {
    if (button) {
      const {onPress, disabled, color} = button;

      const title = OS === 'ios' ? button.title : button.title.toUpperCase();

      const containerStyle = this.getButtonStyle(button, positive);

      const textStyle = this.getButtonTextStyle(button, positive);

      const touchableStyle = OS === 'ios' ? {flex: 1} : {};

      return (
        <TouchableEffect
          onPress={() => {
            onPress(this.state.selectedItem);
          }}
          disabled={disabled}
          style={touchableStyle}>
          <View style={containerStyle}>
            <Text style={textStyle}>{title}</Text>
          </View>
        </TouchableEffect>
      );
    }
  }

  renderContent() {
    const {children} = this.props;

    if (children) {
      return children;
    } else {
      return this.renderLanguagePicker();
    }
  }

  render() {
    return (
      <Dialog
        {...this.props}
        buttons={this.renderButton(this.props.positiveButton, true)}>
        {this.renderContent()}
      </Dialog>
    );
  }
}

const buttonPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
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

LanguagePickerDialog.propTypes = {
  ...Dialog.propTypes,
  message: PropTypes.string,
  messageStyle: Text.propTypes.style,
  selectedItem: PropTypes.number,
  positiveButton: buttonPropType.isRequired,
};

export default LanguagePickerDialog;
