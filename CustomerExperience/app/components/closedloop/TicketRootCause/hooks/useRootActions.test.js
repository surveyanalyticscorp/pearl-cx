import {renderHook, act} from '@testing-library/react-hooks';
import {useSelector} from 'react-redux';
import useRootActions from './useRootActions';
import {hasId} from '../TicketRootCause';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../TicketRootCause', () => ({
  hasId: jest.fn(),
}));

describe('useRootActions Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with an empty rootCauseActions array', () => {
    useSelector.mockReturnValue([]); // Mock empty rootCauseActionList

    const ticket = {rootCauseActions: []};
    const {result} = renderHook(() => useRootActions(ticket));

    expect(result.current).toEqual([]); // rootCauseActions should be an empty array
  });

  it('should update rootCauseActions when rootCauseActionList is available', () => {
    const mockRootCauseActionList = [
      {id: 1, actionName: 'Action A'},
      {id: 2, actionName: 'Action B'},
    ];
    const mockTicket = {rootCauseActions: [1]}; // Ticket has root action ID 1

    useSelector.mockReturnValue(mockRootCauseActionList);
    hasId.mockImplementation((id, rootCauseActions) =>
      rootCauseActions.includes(id),
    );

    const {result} = renderHook(() => useRootActions(mockTicket));

    expect(result.current).toEqual([
      {id: 1, actionName: 'Action A', title: 'Action A', isChecked: true},
      {id: 2, actionName: 'Action B', title: 'Action B', isChecked: false},
    ]);

    expect(hasId).toHaveBeenCalledTimes(2);
  });

  it('should update rootCauseActions when ticket.rootCauseActions change', () => {
    const mockRootCauseActionList = [
      {id: 1, actionName: 'Action A'},
      {id: 2, actionName: 'Action B'},
    ];
    let mockTicket = {rootCauseActions: [1]};

    useSelector.mockReturnValue(mockRootCauseActionList);
    hasId.mockImplementation((id, rootCauseActions) =>
      rootCauseActions.includes(id),
    );

    const {result, rerender} = renderHook(() => useRootActions(mockTicket));

    expect(result.current).toEqual([
      {id: 1, actionName: 'Action A', title: 'Action A', isChecked: true},
      {id: 2, actionName: 'Action B', title: 'Action B', isChecked: false},
    ]);

    // Change ticket rootCauseActions
    mockTicket = {rootCauseActions: [2]};
    rerender();

    expect(result.current).toEqual([
      {id: 1, actionName: 'Action A', title: 'Action A', isChecked: false},
      {id: 2, actionName: 'Action B', title: 'Action B', isChecked: true},
    ]);

    expect(hasId).toHaveBeenCalledTimes(4); // Called twice for each rerender
  });

  it('should return an empty array when rootCauseActionList is empty', () => {
    useSelector.mockReturnValue([]); // Mock empty rootCauseActionList
    const ticket = {rootCauseActions: [1, 2]};

    const {result} = renderHook(() => useRootActions(ticket));

    expect(result.current).toEqual([]); // No actions available
  });
});
