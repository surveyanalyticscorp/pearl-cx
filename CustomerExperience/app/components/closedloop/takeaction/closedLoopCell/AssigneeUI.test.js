import React from 'react';
import {render} from '@testing-library/react-native';
import {useSelector} from 'react-redux';
import AssigneeUI from './AssigneeUI';
import {Avatar} from '../../../../routes/commonUI/CommonUI';
import StringUtils from '../../../../Utils/StringUtils';

// Mock the dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('AssigneeUI', () => {
  const mockOwners = [
    {ownerID: 1, ownerName: 'John Doe'},
    {ownerID: 2, ownerName: 'Jane Smith'},
  ];

  beforeEach(() => {
    useSelector.mockReturnValue(mockOwners);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when assignToId is valid', () => {
    const {getByText} = render(<AssigneeUI assignToId={1} />);
    const avatarTitle = getByText('JD');
    expect(avatarTitle).toBeTruthy();
  });

  it('renders empty avatar when assignToId is null or empty', () => {
    const {queryByText} = render(<AssigneeUI assignToId={null} />);
    expect(queryByText('NA')).toBeTruthy();
  });

  it('renders empty avatar when owner is not found', () => {
    const {queryByText} = render(<AssigneeUI assignToId={99} />);
    expect(queryByText('NA')).toBeTruthy();
  });

  it('returns correct owner name for a given assignToId', () => {
    const {getByText} = render(<AssigneeUI assignToId={2} />);
    const avatarTitle = getByText('JS');
    expect(avatarTitle).toBeTruthy();
  });

  it('handles empty or null assignToId correctly', () => {
    StringUtils.isEmptyOrNull = jest.fn(() => true);
    const {queryByText} = render(<AssigneeUI assignToId={null} />);
    expect(queryByText('NA')).toBeTruthy();
  });
});
