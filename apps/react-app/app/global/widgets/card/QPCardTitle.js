/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight
} from 'react-native';

import QPHorizontalSeparator from './QPHorizontalSeparator';
import CustomText from '../../ui/CustomText';
import colorCodes from '../typography/ColorCodes';

export default class QPCardTitle extends Component {
  render() {
    return (
      <View style={[styles.container,this.props.titleBackgroundStyle ]}>
        <CustomText numberOfLines={3} ellipsizeMode={'tail'} style={[styles.title, colorCodes.primaryFontColor, this.props.titleTextStyle]}>
            {this.props.children}
        </CustomText>
        {this.props.renderOptions || <View/>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding:15,
    backgroundColor: '#f7f7f7',
    flexDirection:'row',
    alignItems:'center'
  },
  title: {
    fontSize: 16,
    flexWrap: 'wrap',
    flex:1
  }
});
