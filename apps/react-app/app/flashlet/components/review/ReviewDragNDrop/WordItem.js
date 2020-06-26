import React, { Component } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './wordItemStyle';

export default class WordItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0
        };
    }

    render() {
        return (
                <View key={this.props.id} style={styles.cell}>
                    <Image style={{ width: 10, height: 12 }} source={getImageUri('threeDots.png')} />
                    <Text style={styles.text}>
                          {this.props.text}
                    </Text>
                </View>
        );
    }
}

const getImageUri = src => {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }
  
    return { uri: src };
  };
