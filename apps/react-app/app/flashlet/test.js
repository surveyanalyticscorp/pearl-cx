import React , {Component} from 'react';
import {
  View,
  Text
} from 'react-native';

class Test extends Component {

  render() {
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray'}}>
        <Text>Presented modally</Text>
      </View>
    )
  }
}

export default Test;
