import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

var styles = require('./QPCardStyleSheet.js');

class QPCardAction extends Component {
  render () {
    const newStyles = this.props.styles || {};
    return (
      <View>
      {this.props.separator ? <Separator /> : null}
      <View style={[styles.cardAction, newStyles.cardAction]}>
      {this.props.children}
      </View>
      </View>
    );
  }
}

module.exports = QPCardAction;
