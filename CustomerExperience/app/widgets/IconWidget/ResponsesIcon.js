import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import ChatBubbleSvgIcon from '../../../assets/images/chat_bubble.svg';
import {MarginConstants} from '../../styles/margin.constants';
import {Sizes} from '../../styles/Size.constant';
const ResponsesIcon = ({
  sizeMultiplyer = 1,
  color = Colors.filterIconColor,
}) => (
  <ChatBubbleSvgIcon
    fill={color}
    height={sizeMultiplyer * Sizes.icons}
    width={sizeMultiplyer * Sizes.icons}
  />
);

const styles = StyleSheet.create({
  rowIcon: {
    margin: MarginConstants.tab1,
  },
});

export default ResponsesIcon;
