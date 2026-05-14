import React from 'react';
import {render} from '@testing-library/react-native';
import ResponsesIcon from './ResponsesIcon';

describe('ResponsesIcon', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<ResponsesIcon />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with default props', () => {
    const {toJSON} = render(<ResponsesIcon />);
    const json = toJSON();
    expect(json).toBeTruthy();
  });

  it('accepts sizeMultiplyer prop without crashing', () => {
    const {toJSON} = render(<ResponsesIcon sizeMultiplyer={2} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts color prop without crashing', () => {
    const {toJSON} = render(<ResponsesIcon color="#ff0000" />);
    expect(toJSON()).toBeTruthy();
  });
});
