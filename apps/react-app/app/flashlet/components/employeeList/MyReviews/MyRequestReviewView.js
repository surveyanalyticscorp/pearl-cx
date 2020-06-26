import React, { Component } from 'react';
import { View, Text, Image, Platform } from 'react-native';

import styles from './MyReviewStyle';

const MyRequestReviewCell = props => {
  return (
    <View style={styles.cell}>
      <Image style={styles.employeeImage} source={{ uri: props.item.avatar }} />
      <View
        style={{
          flex: 1,
          paddingLeft: 12,
          paddingRight: 18,
          flexDirection: 'column'
        }}
      >
        <View
          style={{
            flex: 1,
            paddingBottom: 4,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text style={[styles.textMedium]}>{`${props.item.first_name} ${props.item.last_name}`}</Text>
        </View>
      </View>
        {props.arrow && (<Image source={_getImageUri('arrowRight.png')} style={styles.rightIcon} />)}
    </View>
  );
};
const _getImageUri = src => {
    if (Platform.OS === 'android') {
        return { uri: `asset:/${src}` };
    }

    return { uri: src };
};



export default MyRequestReviewCell;
