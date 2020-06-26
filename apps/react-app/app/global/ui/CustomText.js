/*jshint esversion:6*/

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class CustomText extends Component {
  render() {
    let customStyle = this.props.style || {};
    let props = this.props;
    return (
      <Text 
        {...props}
        onPress={this.props.onPress}
        ref = { text=>  {this.props.ref = text}}
        numberOfLines={this.props.numberOfLines}
        ellipsizeMode={this.props.ellipsizeMode}
        style={[styles.text, customStyle]}>
        {this.props.children}{' '}
      </Text>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    flexWrap: 'wrap',
    fontFamily: 'ProximaNova-Regular',
  }
});
