/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';
import {getTheme} from 'react-native-material-kit';
import QPCardTitle from './QPCardTitle'

const MATERIAL_THEME = getTheme();

export default class QPCard extends Component {
  renderQPCardTitle() {
    if (this.props.title) {
      return (
        <QPCardTitle>{this.props.title}</QPCardTitle>
      )
    } else {
      return (<View></View>)
    }
  }

  render() {
    return (
      <View style={[MATERIAL_THEME.cardStyle]}>
      <TouchableHighlight onPress={this.props.onPress}
                          activeOpacity={0.6}
                          underlayColor={'#CCCCCC'}>
          <View>
              {this.renderQPCardTitle()}

              <View>
                {this.props.children}
              </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:  {
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5
  },
  content:  {
    padding: 8
  }
});
