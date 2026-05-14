import React from 'react';
import {render} from '@testing-library/react-native';
import QPSpinner from './QPSpinner';

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

describe('QPSpinner', () => {
  it('renders without crashing', () => {
    const {getByTestId} = render(<QPSpinner />);
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  it('does not render spinnerText when absent', () => {
    const {queryByText} = render(<QPSpinner />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('renders spinnerText when provided', () => {
    const {getByText} = render(<QPSpinner spinnerText="Loading..." />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('does not render text when spinnerText is empty string', () => {
    const {queryByText} = render(<QPSpinner spinnerText="" />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('accepts spinnerColor prop without crashing', () => {
    const {getByTestId} = render(<QPSpinner spinnerColor="#ff0000" />);
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  it('accepts size and indicatorCount props without crashing', () => {
    const {getByTestId} = render(<QPSpinner size={8} indicatorCount={5} />);
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  it('accepts customSpinnerStyle prop without crashing', () => {
    const {getByTestId} = render(
      <QPSpinner customSpinnerStyle={{padding: 10}} />,
    );
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });
});
