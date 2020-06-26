/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

export default class OnTouchHighlightWidget extends Component {
  render() {
    return (
      <View>
        <TouchableHighlight onPress={this.props.onPress}
                            activeOpacity={0.6}
                            underlayColor={'#CCCCCC'}>
            <View>{this.props.children}</View>
        </TouchableHighlight>
      </View>
    );
  }
}

// OnTouchHighlightWidget.propTypes = {
//   onPress: React.PropTypes.func
// };
