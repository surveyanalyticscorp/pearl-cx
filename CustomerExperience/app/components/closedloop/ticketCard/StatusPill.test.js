import React from 'react';
import {render} from '@testing-library/react-native';
import StatusPill from './StatusPill';

jest.mock('../../../Utils/TicketUtils', () => ({
  getStatusById: jest.fn(id => {
    const statuses = {0: 'New', 1: 'Open', 2: 'Closed'};
    return statuses[id] ?? 'New';
  }),
}));

describe('StatusPill', () => {
  it('renders New status', () => {
    const {getByText} = render(<StatusPill status={0} />);
    expect(getByText('New')).toBeTruthy();
  });

  it('renders Open status', () => {
    const {getByText} = render(<StatusPill status={1} />);
    expect(getByText('Open')).toBeTruthy();
  });

  it('renders Closed status', () => {
    const {getByText} = render(<StatusPill status={2} />);
    expect(getByText('Closed')).toBeTruthy();
  });
});
