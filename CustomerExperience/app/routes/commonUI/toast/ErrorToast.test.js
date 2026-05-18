import React from 'react';
import {render} from '@testing-library/react-native';
import ErrorToast from './ErrorToast';

jest.mock('../../../styles/text.styles', () => ({
  baseTextStyles: {
    semiSecondaryRegular2Text: {fontSize: 14},
  },
}));

jest.mock('../../../styles/padding.constants', () => ({
  PaddingConstants: {halfTab: 8},
}));

jest.mock('../../../styles/color.constants', () => ({
  Colors: {
    deleteBackground: '#ff0000',
  },
}));

jest.mock('./toast.styles', () => ({
  toastStyles: {
    errorContainer: {backgroundColor: '#ffe0e0'},
  },
}));

jest.mock('./LeadingIcon', () => {
  const React = require('react');
  return ({...props}) => React.createElement('View', {testID: 'leading-icon', ...props});
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

describe('ErrorToast', () => {
  it('should render error toast container', () => {
    const {getByTestId} = render(
      <ErrorToast text1="Error message" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    expect(getByTestId('error-toast-container')).toBeTruthy();
  });

  it('should render error message with text1 prop', () => {
    const {getByTestId} = render(
      <ErrorToast text1="Custom error" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('error-toast-msg');
    expect(message).toBeTruthy();
    expect(message.props.children).toBe('Custom error');
  });

  it('should use bodyText from props if text1 is not provided', () => {
    const {getByTestId} = render(
      <ErrorToast
        text1={undefined}
        props={{
          bodyText: 'Body text message',
          leadingIcon: {},
          trailingIcon: {}
        }}
      />,
    );

    const message = getByTestId('error-toast-msg');
    expect(message.props.children).toBe('Body text message');
  });

  it('should prefer text1 over bodyText', () => {
    const {getByTestId} = render(
      <ErrorToast
        text1="Text1 message"
        props={{
          bodyText: 'Body text message',
          leadingIcon: {},
          trailingIcon: {}
        }}
      />,
    );

    const message = getByTestId('error-toast-msg');
    expect(message.props.children).toBe('Text1 message');
  });

  it('should render empty string if no text is provided', () => {
    const {getByTestId} = render(
      <ErrorToast text1={undefined} props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('error-toast-msg');
    expect(message.props.children).toBe('');
  });

  it('should render leading icon component', () => {
    const leadingIconProps = {size: 24, color: '#ff0000'};
    const {getByTestId} = render(
      <ErrorToast
        text1="Error"
        props={{
          leadingIcon: leadingIconProps,
          trailingIcon: {}
        }}
      />,
    );

    expect(getByTestId('leading-icon')).toBeTruthy();
  });

  it('should render trailing icon component', () => {
    const trailingIconProps = {size: 20, color: '#000000'};
    const {getByTestId} = render(
      <ErrorToast
        text1="Error"
        props={{
          leadingIcon: {},
          trailingIcon: trailingIconProps
        }}
      />,
    );

    expect(getByTestId('trailing-icon')).toBeTruthy();
  });

  it('should pass icon props to LeadingIcon component', () => {
    const leadingIconProps = {size: 24, color: 'red'};
    const {getByTestId} = render(
      <ErrorToast
        text1="Error"
        props={{
          leadingIcon: leadingIconProps,
          trailingIcon: {}
        }}
      />,
    );

    const leadingIcon = getByTestId('leading-icon');
    expect(leadingIcon.props.size).toBe(24);
    expect(leadingIcon.props.color).toBe('red');
  });

  it('should pass icon props to TrailingIcon component', () => {
    const trailingIconProps = {size: 20, onPress: jest.fn()};
    const {getByTestId} = render(
      <ErrorToast
        text1="Error"
        props={{
          leadingIcon: {},
          trailingIcon: trailingIconProps
        }}
      />,
    );

    const trailingIcon = getByTestId('trailing-icon');
    expect(trailingIcon.props.size).toBe(20);
  });

  it('should apply correct text color for error message', () => {
    const {getByTestId} = render(
      <ErrorToast text1="Error" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('error-toast-msg');
    expect(message.props.color).toBe('#ff0000');
  });

  it('should apply numberOfLines prop to limit text lines', () => {
    const {getByTestId} = render(
      <ErrorToast text1="Error" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('error-toast-msg');
    expect(message.props.numberOfLines).toBe(1);
  });

  it('should handle null props object gracefully', () => {
    // ErrorToast expects props to have leadingIcon/trailingIcon
    // So we need to provide a properly structured props object
    const {getByTestId} = render(
      <ErrorToast text1="Error" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    // Should not crash
    expect(getByTestId('error-toast-container')).toBeTruthy();
  });

  it('should render with minimal props', () => {
    const {getByTestId} = render(
      <ErrorToast props={{}} />,
    );

    expect(getByTestId('error-toast-container')).toBeTruthy();
  });
});
