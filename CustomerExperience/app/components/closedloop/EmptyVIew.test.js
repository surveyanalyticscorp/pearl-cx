import React from 'react';
import {render} from '@testing-library/react-native';
import {EmptyView} from './EmptyVIew';

jest.mock('../../../assets/images/empty_state.svg', () => 'EmptyState');

describe('EmptyView', () => {
  it('renders with testID', () => {
    const {getByTestId} = render(
      <EmptyView title="No data" subTitle="Try again later" />,
    );
    expect(getByTestId('list-empty-view')).toBeTruthy();
  });

  it('renders title text', () => {
    const {getAllByTestId} = render(
      <EmptyView title="No tickets" subTitle="Check your filters" />,
    );
    const labels = getAllByTestId('text-label');
    expect(labels[0].props.children).toBe('No tickets');
  });

  it('renders subtitle text', () => {
    const {getAllByTestId} = render(
      <EmptyView title="No tickets" subTitle="Check your filters" />,
    );
    const labels = getAllByTestId('text-label');
    expect(labels[1].props.children).toBe('Check your filters');
  });
});
