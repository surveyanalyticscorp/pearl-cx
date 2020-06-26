// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import Keyboard from './Keyboard';
import * as Emojis from './Emojis';

export default class TabbedView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView>
        <Keyboard tabLabel="😃" onPress={this.props.onPress} data={Emojis.people}/>
        <Keyboard tabLabel="🐻" onPress={this.props.onPress} data={Emojis.animals}/>
        <Keyboard tabLabel="🍔" onPress={this.props.onPress} data={Emojis.food}/>
        <Keyboard tabLabel="⚽" onPress={this.props.onPress} data={Emojis.activity}/>
        <Keyboard tabLabel="🌇" onPress={this.props.onPress} data={Emojis.travel}/>
      </ScrollableTabView>
    );
  }
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  iconStyle: {
    borderTopWidth:2,
    borderTopColor:'red'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
