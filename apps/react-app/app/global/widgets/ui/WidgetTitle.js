import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

export default class WidgetTitle extends Component{

  render(){
      return (
        <View style={styles.container}>
          <Text ellipsizeMode ={'tail'} numberOfLines = {3} style={styles.textStyle}>
              {this.props.children}
          </Text>
        </View>
      );

  }

}

// WidgetTitle.propTypes = {
//   title : React.PropTypes.string
// };

const styles = StyleSheet.create({
  container:  {
    padding: 8,
    backgroundColor: '#f7f7f7'
  },
  textStyle:{
    fontSize: 16,
    color: '#303030'
  }
});
