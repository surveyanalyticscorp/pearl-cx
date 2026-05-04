import React from 'react';
import {Colors} from '../styles/color.constants';
import {Pressable} from 'react-native';
import SendCommentIcon from '../../assets/images/send_comment.svg';
import {PaddingConstants} from '../styles/padding.constants';

const SendCommentButton = ({handleOnSubmit, size, color, buttonStyle}) => {
  const size_ = size ?? 24;
  const color_ = color ?? Colors.filterIconColor;
  const style_ = buttonStyle ?? {padding: PaddingConstants.halfTab, margin: 0};
  return (
    <Pressable style={style_} onPress={handleOnSubmit}>
      <SendCommentIcon width={size_} height={size_} fill={color_} />
    </Pressable>
  );
};

export default SendCommentButton;
