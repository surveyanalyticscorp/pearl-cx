import React from 'react';
import {StyleSheet, Text} from 'react-native';

const SimpleText = ({children}) => {
  return <Text style={style.SimpleText}>{children}</Text>;
};

const style = StyleSheet.create({SimpleText: {fontSize: 34}});

export default SimpleText;
