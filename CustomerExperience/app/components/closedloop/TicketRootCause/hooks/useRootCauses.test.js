import {renderHook, act} from '@testing-library/react-hooks';
import {useSelector} from 'react-redux';
import useRootCauses from './useRootCauses'; // Update path
import {hasId} from '../TicketRootCause';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../TicketRootCause', () => ({
  hasId: jest.fn(),
}));

describe('useRootCauses Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with an empty rootCauses array', () => {
    useSelector.mockReturnValue([]); // Mock empty rootCauseList

    const ticket = {rootCauses: []};
    const {result} = renderHook(() => useRootCauses(ticket));

    expect(result.current).toEqual([]); // rootCauses should be an empty array
  });

  it('should update rootCauses when rootCauseList is available', () => {
    const mockRootCauseList = [
      {id: 1, name: 'Cause A'},
      {id: 2, name: 'Cause B'},
    ];
    const mockTicket = {rootCauses: [1]}; // Ticket has root cause ID 1

    useSelector.mockReturnValue(mockRootCauseList);
    hasId.mockImplementation((id, rootCauses) => rootCauses.includes(id));

    const {result, rerender} = renderHook(() => useRootCauses(mockTicket));

    expect(result.current).toEqual([
      {id: 1, name: 'Cause A', isChecked: true},
      {id: 2, name: 'Cause B', isChecked: false},
    ]);

    expect(hasId).toHaveBeenCalledTimes(2);
  });

  it('should update rootCauses when ticket.rootCauses change', () => {
    const mockRootCauseList = [
      {id: 1, name: 'Cause A'},
      {id: 2, name: 'Cause B'},
    ];
    let mockTicket = {rootCauses: [1]};

    useSelector.mockReturnValue(mockRootCauseList);
    hasId.mockImplementation((id, rootCauses) => rootCauses.includes(id));

    const {result, rerender} = renderHook(() => useRootCauses(mockTicket));

    expect(result.current).toEqual([
      {id: 1, name: 'Cause A', isChecked: true},
      {id: 2, name: 'Cause B', isChecked: false},
    ]);

    // Change ticket root causes
    mockTicket = {rootCauses: [2]};
    rerender();

    expect(result.current).toEqual([
      {id: 1, name: 'Cause A', isChecked: false},
      {id: 2, name: 'Cause B', isChecked: true},
    ]);

    expect(hasId).toHaveBeenCalledTimes(4); // Called twice for each rerender
  });

  it('should return an empty array when rootCauseList is empty', () => {
    useSelector.mockReturnValue([]); // Mock empty rootCauseList
    const ticket = {rootCauses: [1, 2]};

    const {result} = renderHook(() => useRootCauses(ticket));

    expect(result.current).toEqual([]); // No causes available
  });
});
