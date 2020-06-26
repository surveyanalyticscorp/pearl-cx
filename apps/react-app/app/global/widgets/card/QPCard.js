/*jshint esversion:6*/

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';
import QPCardTitle from './QPCardTitle'

export default class QPCard extends Component {
  renderQPCardTitle() {
    let props = this.props;
    if (this.props.title) {
      return (
        <QPCardTitle {...props}>{this.props.title}</QPCardTitle>
      )
    } else if (this.props.customTitle) {
      return (
          <View>{this.props.customTitle}</View>
          );
    } else {
      return (<View></View>)
    }
  }

  render() {
    let { style } = this.props;
    return (
      <View style={style}>

        <View>
          {this.renderQPCardTitle()}

          <View>
            {this.props.children}
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5
  },
  content: {
    padding: 8
  }
});
