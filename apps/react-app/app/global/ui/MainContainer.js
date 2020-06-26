/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Platform,
  Image
} from 'react-native';

export default class MainContainer extends React.Component {

  getBackGroundImage() {
          if (Platform.OS != 'ios') {
              return require('../images/background.png');
          }
          let iosImage = {uri:'background.png'};
          return iosImage;
      }

    render() {
      return (
          <Image source ={this.getBackGroundImage()}
                style ={styles.imageStyle}>
            <View style={styles.container}>
              {this.props.children}
            </View>
        </Image>
      );
    }
  }

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  imageStyle: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'

  }

});
