import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';

export default function EmptyList({style, fontStyle, children}) {
  return (
    <View style={{...styles.container, ...style}}>
      <Text style={{...styles.text, ...fontStyle}}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
    padding: PaddingConstants.halfTab,
  },
}); // export default EmptyList;
