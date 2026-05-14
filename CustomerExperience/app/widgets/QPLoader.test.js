import React from 'react';
import {render} from '@testing-library/react-native';
import QPLoader from './QPLoader';

jest.mock('../Utils/StringUtils', () => ({
  isEmpty: jest.fn(value => !value || value.length === 0),
}));

describe('QPLoader', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<QPLoader />);
    expect(toJSON()).toBeTruthy();
  });

  it('does not render spinnerText when absent', () => {
    const {queryByText} = render(<QPLoader />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('renders spinnerText when provided', () => {
    const {getByText} = render(<QPLoader spinnerText="Loading..." />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('does not render text element when spinnerText is empty string', () => {
    const {queryByText} = render(<QPLoader spinnerText="" />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('accepts size prop without crashing', () => {
    const {toJSON} = render(<QPLoader size={50} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts spinnerColor prop without crashing', () => {
    const {toJSON} = render(<QPLoader spinnerColor="#ff0000" />);
    expect(toJSON()).toBeTruthy();
  });
});
