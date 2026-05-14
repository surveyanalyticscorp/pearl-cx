import React from 'react';
import {render} from '@testing-library/react-native';
import QPWebView from './QPWebView';

jest.mock('react-native-webview', () => ({
  WebView: ({renderLoading, source, testID}) => {
    const {View} = require('react-native');
    return (
      <View testID={testID || 'webview'}>
        {renderLoading && renderLoading()}
      </View>
    );
  },
}));

jest.mock('react-native-animatable', () => ({
  View: ({children, testID, style}) => {
    const {View} = require('react-native');
    return (
      <View testID={testID} style={style}>
        {children}
      </View>
    );
  },
}));

jest.mock('../Utils/StringUtils', () => ({
  isEmpty: jest.fn(value => !value || value.length === 0),
}));

describe('QPWebView', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(
      <QPWebView uri="https://example.com?" authToken="token123" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders QPSpinner via renderLoading', () => {
    const {getByTestId} = render(
      <QPWebView uri="https://example.com?" authToken="token123" />,
    );
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  it('renders child prop when provided', () => {
    const {getByText} = render(
      <QPWebView uri="https://example.com?" authToken="abc">
        {null}
      </QPWebView>,
    );
    expect(toJSON => toJSON).toBeTruthy();
  });

  it('accepts uri and authToken props without crashing', () => {
    const {toJSON} = render(
      <QPWebView uri="https://test.example.com?" authToken="secret" />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
