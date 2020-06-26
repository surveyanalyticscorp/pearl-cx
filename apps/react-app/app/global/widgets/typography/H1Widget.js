/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class H1Widget extends Component {
  render() {
    let customStyle = this.props.style || {};
    return (
      <Text style={[styles.text, customStyle]}>{this.props.children}</Text>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    flexWrap: 'wrap'
  }
});
