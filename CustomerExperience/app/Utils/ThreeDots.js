import React from 'react';
import {View, StyleSheet} from 'react-native';

const ThreeDot = props => {
  var circles = [];
  for (let i = 0; i < 3; i++) {
    circles.push(<Circle color={props.color} key={i} />);
  }

  return <View style={styles.container}>{circles}</View>;
};

const Circle = props => {
  return <View style={[styles.dot, {backgroundColor: props.color}]} />;
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 10,
    paddingLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default ThreeDot;
