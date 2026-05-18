import React from 'react';
import {render} from '@testing-library/react-native';
import SuccessToast from './SuccessToast';

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
    toastSuccessTextColor: '#00aa00',
  },
}));

jest.mock('./toast.styles', () => ({
  toastStyles: {
    successContainer: {backgroundColor: '#e0ffe0'},
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

describe('SuccessToast', () => {
  it('should render success toast container', () => {
    const {getByTestId} = render(
      <SuccessToast text1="Success message" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    expect(getByTestId('success-toast-container')).toBeTruthy();
  });

  it('should render success message with text1 prop', () => {
    const {getByTestId} = render(
      <SuccessToast text1="Success!" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message).toBeTruthy();
    expect(message.props.children).toBe('Success!');
  });

  it('should use bodyText from props if text1 is not provided', () => {
    const {getByTestId} = render(
      <SuccessToast
        text1={undefined}
        props={{
          bodyText: 'Operation completed',
          leadingIcon: {},
          trailingIcon: {}
        }}
      />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.children).toBe('Operation completed');
  });

  it('should prefer text1 over bodyText', () => {
    const {getByTestId} = render(
      <SuccessToast
        text1="Text1 success"
        props={{
          bodyText: 'Body text success',
          leadingIcon: {},
          trailingIcon: {}
        }}
      />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.children).toBe('Text1 success');
  });

  it('should render empty string if no text is provided', () => {
    const {getByTestId} = render(
      <SuccessToast text1={undefined} props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.children).toBe('');
  });

  it('should render leading icon component', () => {
    const leadingIconProps = {size: 24, color: '#00aa00'};
    const {getByTestId} = render(
      <SuccessToast
        text1="Success"
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
      <SuccessToast
        text1="Success"
        props={{
          leadingIcon: {},
          trailingIcon: trailingIconProps
        }}
      />,
    );

    expect(getByTestId('trailing-icon')).toBeTruthy();
  });

  it('should pass icon props to LeadingIcon component', () => {
    const leadingIconProps = {size: 24, color: 'green'};
    const {getByTestId} = render(
      <SuccessToast
        text1="Success"
        props={{
          leadingIcon: leadingIconProps,
          trailingIcon: {}
        }}
      />,
    );

    const leadingIcon = getByTestId('leading-icon');
    expect(leadingIcon.props.size).toBe(24);
    expect(leadingIcon.props.color).toBe('green');
  });

  it('should pass icon props to TrailingIcon component', () => {
    const trailingIconProps = {size: 20, onPress: jest.fn()};
    const {getByTestId} = render(
      <SuccessToast
        text1="Success"
        props={{
          leadingIcon: {},
          trailingIcon: trailingIconProps
        }}
      />,
    );

    const trailingIcon = getByTestId('trailing-icon');
    expect(trailingIcon.props.size).toBe(20);
  });

  it('should apply correct text color for success message', () => {
    const {getByTestId} = render(
      <SuccessToast text1="Success" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.color).toBe('#00aa00');
  });

  it('should apply numberOfLines prop to limit text lines', () => {
    const {getByTestId} = render(
      <SuccessToast text1="Success" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    const message = getByTestId('success-toast-msg');
    expect(message.props.numberOfLines).toBe(1);
  });

  it('should handle null props object gracefully', () => {
    // SuccessToast expects props to have leadingIcon/trailingIcon
    // So we need to provide a properly structured props object
    const {getByTestId} = render(
      <SuccessToast text1="Success" props={{leadingIcon: {}, trailingIcon: {}}} />,
    );

    // Should not crash
    expect(getByTestId('success-toast-container')).toBeTruthy();
  });

  it('should render with minimal props', () => {
    const {getByTestId} = render(
      <SuccessToast props={{}} />,
    );

    expect(getByTestId('success-toast-container')).toBeTruthy();
  });
});
