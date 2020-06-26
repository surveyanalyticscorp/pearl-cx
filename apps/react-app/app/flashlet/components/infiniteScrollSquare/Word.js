import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Platform } from 'react-native';

import styles from './wordStyle';

class Word extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0
    };
  }

  _longPressAction = () => {
    this.props.onPress();
  };

  _getTextDimension = ({ width }) => {
    this.setState({
      width: width
    });
  };

  render() {
    return (
      <TouchableHighlight
        ref={'word'}
        disabled={this.props.disabled}
        underlayColor="rgba(0, 0, 0, 0.1)"
        onPress={this._longPressAction}
        style={[styles.cell, this.props.cellStyle]}
      >
        <View>
          <Text
            onLayout={this._getTextDimension}
            style={[styles.text, { color: '#1A9BEB' }]}
          >
            {this.props.text}
          </Text>
          <View
            style={[
              styles.underLine,
              { width: this.state.width, backgroundColor: '#1A9BEB' }
            ]}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

export default Word;
