import React from 'react';
import {Text} from 'react-native';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import TextLabel from './TextLabel/TextLabel';
import {baseTextStyles} from '../styles/text.styles';
import {FontWeight} from '../styles/font.constants';

const NPSAnswerText = ({sentiment, answerText}) => {
  function getNPSColor() {
    switch (sentiment) {
      case 'Detractor':
        return Colors.detractor2;
      case 'Passive':
        return Colors.passive2;
      default:
        return Colors.promoter2;
    }
  }
  return (
    <TextLabel
      text={answerText}
      baseTextStyle={baseTextStyles.primaryRegularText}
      fontWeight={FontWeight.bold}
      color={getNPSColor(sentiment)}
    />
  );
};

export default NPSAnswerText;
