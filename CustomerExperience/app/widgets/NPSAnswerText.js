import React from 'react';
import {Text} from 'react-native';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import TextLabel from './TextLabel/TextLabel';
import {baseTextStyles} from '../styles/text.styles';
import {FontWeight} from '../styles/font.constants';
import {getNPSColor} from '../styles/color.constants';

const NPSAnswerText = ({sentiment, answerText}) => {
  return (
    <TextLabel
      testID="NPSAnswerText"
      text={answerText}
      baseTextStyle={baseTextStyles.primaryRegularText}
      fontWeight={FontWeight.bold}
      color={getNPSColor(sentiment)}
    />
  );
};

export default NPSAnswerText;
