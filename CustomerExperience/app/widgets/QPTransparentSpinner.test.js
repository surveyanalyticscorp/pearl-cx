import React from 'react';
import {render} from '@testing-library/react-native';
import {QPTransparentSpinner} from './QPTransparentSpinner';

jest.mock('../Utils/StringUtils', () => ({
  isEmpty: jest.fn(value => !value || value.length === 0),
}));

describe('QPTransparentSpinner', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<QPTransparentSpinner />);
    expect(toJSON()).toBeTruthy();
  });

  it('does not render subText when absent', () => {
    const {queryByText} = render(<QPTransparentSpinner />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('renders subText when provided', () => {
    const {getByText} = render(<QPTransparentSpinner subText="Please wait" />);
    expect(getByText('Please wait')).toBeTruthy();
  });

  it('does not render subText when empty string', () => {
    const {queryByText} = render(<QPTransparentSpinner subText="" />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('accepts containerStyle prop without crashing', () => {
    const {toJSON} = render(
      <QPTransparentSpinner containerStyle={{backgroundColor: 'blue'}} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('accepts textStyle prop without crashing', () => {
    const {toJSON} = render(
      <QPTransparentSpinner subText="wait" textStyle={{fontSize: 20}} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('accepts idicatorColor and animationType props without crashing', () => {
    const {toJSON} = render(
      <QPTransparentSpinner idicatorColor="#ff0000" animationType="fadeOut" />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
