import React from 'react';
import {render} from '@testing-library/react-native';
import ShowInputError from './ShowInputError';

jest.mock('../../styles/margin.constants', () => ({
  MarginConstants: {tab1: 8},
}));

jest.mock('../../styles/padding.constants', () => ({
  PaddingConstants: {halfTab: 4},
}));

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    deleteButtonText: '#cc0000',
  },
}));

jest.mock('../../styles/font.constants', () => ({
  FontFamily: {regular: 'System'},
  FontWeight: {_300: '300'},
}));

jest.mock('../../styles/textsize.constants', () => ({
  TextSizes: {secondary: 14},
}));

jest.mock('../../widgets/TextLabel/TextLabel', () => {
  const React = require('react');
  return ({testID, text, ...props}) =>
    React.createElement('Text', {testID, children: text, ...props}, text);
});

describe('ShowInputError', () => {
  it('should not render anything when isError is false', () => {
    const {queryByText} = render(
      <ShowInputError isError={false} errorMessage="Error message" />,
    );

    expect(queryByText('Error message')).toBeNull();
  });

  it('should render error message when isError is true', () => {
    const {getByText} = render(
      <ShowInputError isError={true} errorMessage="Required field" />,
    );

    expect(getByText('Required field')).toBeTruthy();
  });

  it('should render with default empty error message', () => {
    const {UNSAFE_root} = render(
      <ShowInputError isError={true} />,
    );

    // Component should render even with empty message
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should not render when isError is undefined (falsy)', () => {
    const {queryByText} = render(
      <ShowInputError isError={undefined} errorMessage="Error" />,
    );

    expect(queryByText('Error')).toBeNull();
  });

  it('should not render when isError is null (falsy)', () => {
    const {queryByText} = render(
      <ShowInputError isError={null} errorMessage="Error" />,
    );

    expect(queryByText('Error')).toBeNull();
  });

  it('should not render when isError is 0 (falsy)', () => {
    const {queryByText} = render(
      <ShowInputError isError={0} errorMessage="Error" />,
    );

    expect(queryByText('Error')).toBeNull();
  });

  it('should not render when isError is empty string (falsy)', () => {
    const {queryByText} = render(
      <ShowInputError isError="" errorMessage="Error" />,
    );

    expect(queryByText('Error')).toBeNull();
  });

  it('should render with different error messages', () => {
    const {getByText: getByText1} = render(
      <ShowInputError isError={true} errorMessage="Email is invalid" />,
    );
    expect(getByText1('Email is invalid')).toBeTruthy();
  });

  it('should handle long error messages', () => {
    const longError = 'This is a very long error message that might wrap to multiple lines';
    const {getByText} = render(
      <ShowInputError isError={true} errorMessage={longError} />,
    );

    expect(getByText(longError)).toBeTruthy();
  });

  it('should render with special characters in error message', () => {
    const specialError = 'Error: !@#$%^&*()_+-=[]{}|;:",.<>?';
    const {getByText} = render(
      <ShowInputError isError={true} errorMessage={specialError} />,
    );

    expect(getByText(specialError)).toBeTruthy();
  });

  it('should render TextLabel component with error message', () => {
    const {UNSAFE_getByType} = render(
      <ShowInputError isError={true} errorMessage="Error text" />,
    );

    // Should render a Text component (our mocked TextLabel)
    const textComponent = UNSAFE_getByType('Text');
    expect(textComponent.props.children).toBe('Error text');
  });

  it('should apply correct text to TextLabel', () => {
    const errorMsg = 'Invalid input';
    const {UNSAFE_getByType} = render(
      <ShowInputError isError={true} errorMessage={errorMsg} />,
    );

    const textComponent = UNSAFE_getByType('Text');
    expect(textComponent.props.children).toBe(errorMsg);
  });
});
