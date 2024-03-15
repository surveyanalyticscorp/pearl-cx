import React from 'react';
import {View} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';

export const VerticalSpaceBox = ({style, marginVertical, multiplyBy = 1}) => {
  const marginVertical_ = marginVertical
    ? marginVertical * multiplyBy
    : MarginConstants.halfTab * multiplyBy;
  const style_ = {marginVertical: marginVertical_, ...style};
  return <View style={style_} />;
};

export const HorizontalSpaceBox = ({
  style,
  marginHorizontal,
  multiplyBy = 1,
}) => {
  const marginHorizontal_ = marginHorizontal
    ? marginHorizontal * multiplyBy
    : MarginConstants.halfTab * multiplyBy;
  const style_ = {marginHorizontal: marginHorizontal_, ...style};
  return <View style={style_} />;
};
