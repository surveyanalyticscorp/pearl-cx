import React from 'react';
import {render} from '@testing-library/react-native';
import RefineLabel from './RefineLabel';

jest.mock('../../../widgets/Button', () => ({buttonText}) => {
  const {Text} = require('react-native');
  return <Text>{buttonText}</Text>;
});

describe('RefineLabel', () => {
  it('renders with Refine label', () => {
    const {getByText} = render(<RefineLabel />);
    expect(getByText('Refine')).toBeTruthy();
  });
});
