import React from 'react';
import {View} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';

export const VerticalSpaceBox = ({marginVertical}) => {
  const style_ = marginVertical
    ? {marginVertical: marginVertical}
    : {marginVertical: MarginConstants.halfTab};
  return <View style={style_} />;
};

export const HorizontalSpaceBox = ({marginHorizontal}) => {
  const style_ = marginHorizontal
    ? {marginVertical: marginHorizontal}
    : {marginVertical: MarginConstants.halfTab};
  return <View style={style_} />;
};
