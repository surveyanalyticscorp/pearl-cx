import React from 'react';
import {render} from '@testing-library/react-native';
import NewResponse from './NewResponse';

// write tests for NewResponse.js file
describe('NewResponse', () => {
  it('renders correctly', () => {
    const {getByText} = render(<NewResponse />);
    expect(getByText('New')).toBeTruthy();
  });
});
