import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Dimensions
} from 'react-native';

import TabbedView from './TabbedView';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import EmojiInput from './EmojiInput';

export default class RootView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      emoji: false,
      visibleHeight: Dimensions.get('window').height,
      visibleWidth: Dimensions.get('window').width,

    }
  }
  render() {
    return (
      <View style={[styles.container,{height:this.state.visibleHeight}]}>
        <Text style={{marginTop:30,fontSize:30}}>Emoji WOW Keyboard!</Text>
        <View style={{flex:1}}></View>
        <EmojiInput/>
      </View>
    );
  }

  toggleEmoji() {
    const oldEmoji = this.state.emoji;
    dismissKeyboard();
    this.setState({emoji: !oldEmoji});
  }

  componentWillMount () {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
  }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height;
    this.setState({visibleHeight: newSize});
    this.setState({emoji: false});
  }

  keyboardWillHide (e) {
    this.setState({visibleHeight: Dimensions.get('window').height})
  }

  onPress(x) {
    this.setState({
      text: this.state.text + x
    })
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
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
