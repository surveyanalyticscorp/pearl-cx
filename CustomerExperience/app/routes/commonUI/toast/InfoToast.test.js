import React from 'react';
import {render} from '@testing-library/react-native';
import InfoToast from './InfoToast';

jest.mock('../../../styles/text.styles', () => ({
  baseTextStyles: {
    semiSecondaryRegular2Text: {fontSize: 14},
  },
}));

jest.mock('../../../styles/padding.constants', () => ({
  PaddingConstants: {halfTab: 8},
}));

jest.mock('../../../styles/margin.constants', () => ({
  MarginConstants: {tab1: 8},
}));

jest.mock('../../../styles/color.constants', () => ({
  Colors: {
    accent: '#0066cc',
  },
}));

jest.mock('./toast.styles', () => ({
  toastStyles: {
    infoContainer: {backgroundColor: '#e0f0ff'},
  },
}));

jest.mock('./InfoIcon', () => {
  const React = require('react');
  return () => React.createElement('View', {testID: 'info-icon'});
});

jest.mock('./TrailingIcon', () => {
  const React = require('react');
  return ({...props}) => React.createElement('View', {testID: 'trailing-icon', ...props});
});

jest.mock('../../../widgets/TextLabel/TextLabel', () => {
  const React = require('react');
  return ({testID, text, ...props}) =>
    React.createElement('Text', {testID, children: text, ...props}, text);
});

describe('InfoToast', () => {
  it('should render info toast container', () => {
    const {getByTestId} = render(
      <InfoToast text1="Info message" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    expect(getByTestId('info-toast-container')).toBeTruthy();
  });

  it('should render info message with text1 prop', () => {
    const {getByTestId} = render(
      <InfoToast text1="Information" props={{trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message).toBeTruthy();
    expect(message.props.children).toBe('Information');
  });

  it('should use bodyText from props if text1 is not provided', () => {
    const {getByTestId} = render(
      <InfoToast
        text1={undefined}
        props={{
          bodyText: 'Body info text',
          trailingIcon: {}
        }}
      />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.children).toBe('Body info text');
  });

  it('should prefer text1 over bodyText', () => {
    const {getByTestId} = render(
      <InfoToast
        text1="Text1 info"
        props={{
          bodyText: 'Body text info',
          trailingIcon: {}
        }}
      />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.children).toBe('Text1 info');
  });

  it('should render empty string if no text is provided', () => {
    const {getByTestId} = render(
      <InfoToast text1={undefined} props={{trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.children).toBe('');
  });

  it('should render info icon component', () => {
    const {getByTestId} = render(
      <InfoToast text1="Info" props={{trailingIcon: {}}} />,
    );

    expect(getByTestId('info-icon')).toBeTruthy();
  });

  it('should render trailing icon component', () => {
    const trailingIconProps = {size: 20};
    const {getByTestId} = render(
      <InfoToast
        text1="Info"
        props={{
          trailingIcon: trailingIconProps
        }}
      />,
    );

    expect(getByTestId('trailing-icon')).toBeTruthy();
  });

  it('should pass icon props to TrailingIcon component', () => {
    const trailingIconProps = {size: 20, onPress: jest.fn()};
    const {getByTestId} = render(
      <InfoToast
        text1="Info"
        props={{
          trailingIcon: trailingIconProps
        }}
      />,
    );

    const trailingIcon = getByTestId('trailing-icon');
    expect(trailingIcon.props.size).toBe(20);
  });

  it('should apply correct text color for info message', () => {
    const {getByTestId} = render(
      <InfoToast text1="Info" props={{trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.color).toBe('#0066cc');
  });

  it('should apply numberOfLines prop to limit text lines', () => {
    const {getByTestId} = render(
      <InfoToast text1="Info" props={{trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.numberOfLines).toBe(1);
  });

  it('should render with minimal props', () => {
    const {getByTestId} = render(
      <InfoToast props={{trailingIcon: {}}} />,
    );

    expect(getByTestId('info-toast-container')).toBeTruthy();
  });

  it('should handle multiple text lengths', () => {
    const longText = 'This is a very long info message that would normally wrap to multiple lines but should be limited to one';
    const {getByTestId} = render(
      <InfoToast text1={longText} props={{trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.numberOfLines).toBe(1);
  });
});
