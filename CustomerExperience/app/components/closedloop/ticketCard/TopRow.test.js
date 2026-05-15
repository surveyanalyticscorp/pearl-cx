import React from 'react';
import {render} from '@testing-library/react-native';
import TopRow from './TopRow';

jest.mock('./TopRowIcon', () => () => {
  const {View} = require('react-native');
  return <View testID="top-row-icon" />;
});

describe('TopRow', () => {
  it('renders email text', () => {
    const {getByText} = render(
      <TopRow email="user@test.com" hasPanelMember={true} ticketId="T1" />,
    );
    expect(getByText('user@test.com')).toBeTruthy();
  });

  it('renders ticket ID with # prefix', () => {
    const {getByText} = render(
      <TopRow email="user@test.com" hasPanelMember={true} ticketId="T42" />,
    );
    expect(getByText('#T42')).toBeTruthy();
  });

  it('renders icon', () => {
    const {getByTestId} = render(
      <TopRow email="user@test.com" hasPanelMember={false} ticketId="T1" />,
    );
    expect(getByTestId('top-row-icon')).toBeTruthy();
  });
});
