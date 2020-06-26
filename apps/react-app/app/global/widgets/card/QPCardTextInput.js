import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight
} from 'react-native';

import CustomText from '../../ui/CustomText';

export default class QPCardTextInput extends Component {
    constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  
  render() {
    return (
      <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) =>{ 
          this.setState({text});
          this.props.onChangeText(text);
        }}
        value={this.state.text}
        editable={true}
        multiline={true} 
        autoFocus={true}
        underlineColorAndroid ={'transparent'}/>
      </View>
    );
  }
  
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex:1,
    flexDirection : 'column'
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    padding:15,
    color: 'black',
    flexWrap: 'wrap',
    textAlignVertical: 'top'
  }
});
