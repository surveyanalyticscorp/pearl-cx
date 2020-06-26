import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

var styles = require('./QPCardStyleSheet.js');

class QPCardContent extends Component {
  render () {
    const newStyles = this.props.styles || {};
    return (
      <View style={[styles.cardContent, newStyles.cardContent]}>
      {this.props.children}
      </View>
    );
  }
}

module.exports = QPCardContent;
