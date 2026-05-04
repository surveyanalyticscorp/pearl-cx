import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {baseTextStyles} from '../../../styles/text.styles';

const COMMENT_LINE_HEIGHT = 22;

const CommentText = ({comment}) => (
  <Text
    style={[styles.commentText, {minHeight: COMMENT_LINE_HEIGHT * 3}]}
    numberOfLines={3}
    ellipsizeMode="tail">
    {comment}
  </Text>
);

const styles = StyleSheet.create({
  commentText: {
    ...baseTextStyles.primaryRegularText,
    color: Colors.filterIconColor,
    marginHorizontal: 0,
    marginBottom: MarginConstants.tab1_2x,
    lineHeight: COMMENT_LINE_HEIGHT,
  },
});

export default CommentText;
