import React from 'react';
import {render} from '@testing-library/react-native';
import {TagViewItem} from './TagViewItem';

jest.mock('../../../widgets/TextLabel/TextLabel', () => ({text}) => {
  const {Text} = require('react-native');
  return <Text testID="tag-label">{text}</Text>;
});

describe('TagViewItem', () => {
  it('renders the tag name', () => {
    const {getByText} = render(<TagViewItem item={{id: 1, name: 'Quality'}} />);
    expect(getByText('Quality')).toBeTruthy();
  });

  it('renders a different tag name', () => {
    const {getByText} = render(<TagViewItem item={{id: 2, name: 'Delivery'}} />);
    expect(getByText('Delivery')).toBeTruthy();
  });

  it('renders the testID', () => {
    const {getByTestId} = render(<TagViewItem item={{id: 1, name: 'Support'}} />);
    expect(getByTestId('tag-label')).toBeTruthy();
  });
});
