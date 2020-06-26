/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import CustomText from '../../ui/CustomText';
import colorCodes from './ColorCodes';

export default class H3Widget extends Component {
  render() {
    let customStyle = this.props.style || {};
    return (
      <CustomText style={[styles.text, customStyle, colorCodes.secondaryFontColor]}>{this.props.children}</CustomText>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red'
  }
});
