import React from 'react';
import {render} from '@testing-library/react-native';
import NPSAnswerText from './NPSAnswerText';

describe('NPSAnswerText', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(
      <NPSAnswerText sentiment="Promoter" answerText="Great!" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders the answerText', () => {
    const {getByText} = render(
      <NPSAnswerText sentiment="Promoter" answerText="Very satisfied" />,
    );
    expect(getByText('Very satisfied')).toBeTruthy();
  });

  it('renders with testID NPSAnswerText', () => {
    const {getByTestId} = render(
      <NPSAnswerText sentiment="Promoter" answerText="Great!" />,
    );
    expect(getByTestId('NPSAnswerText')).toBeTruthy();
  });

  it('renders with Detractor sentiment without crashing', () => {
    const {getByText} = render(
      <NPSAnswerText sentiment="Detractor" answerText="Not happy" />,
    );
    expect(getByText('Not happy')).toBeTruthy();
  });

  it('renders with Passive sentiment without crashing', () => {
    const {getByText} = render(
      <NPSAnswerText sentiment="Passive" answerText="Neutral" />,
    );
    expect(getByText('Neutral')).toBeTruthy();
  });

  it('renders with unknown sentiment using default color', () => {
    const {getByText} = render(
      <NPSAnswerText sentiment="Unknown" answerText="Hmm" />,
    );
    expect(getByText('Hmm')).toBeTruthy();
  });
});
