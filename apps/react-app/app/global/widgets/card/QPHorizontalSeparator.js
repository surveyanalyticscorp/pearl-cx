/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class QPHorizontalSeparator extends Component {
  render () {
    return (<View style={styles.separator}/>)
  }
}

const styles = StyleSheet.create({
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#b2b2b2',
    alignSelf: 'stretch',
    marginLeft: 8,
    marginRight:8
  }
});
