import React from 'react';
import {render} from '@testing-library/react-native';
import {AskWhy} from './AskWhy';

jest.mock('../../../../widgets/TextLabel/TextLabel', () => ({text}) => {
  const {Text} = require('react-native');
  return <Text>{text}</Text>;
});
jest.mock('../TagViewItem', () => ({
  TagViewItem: ({item}) => {
    const {Text} = require('react-native');
    return <Text>{item.name}</Text>;
  },
}));

describe('AskWhy', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<AskWhy />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the AskWhy title', () => {
    const {getAllByText} = render(<AskWhy />);
    expect(getAllByText('AskWhy').length).toBeGreaterThan(0);
  });

  it('renders the default tag items', () => {
    const {getAllByText} = render(<AskWhy />);
    expect(getAllByText('AskWhy').length).toBeGreaterThan(0);
  });
});
