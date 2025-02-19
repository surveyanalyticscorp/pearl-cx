import {renderHook, act} from '@testing-library/react-hooks';
import {useDispatch, useSelector} from 'react-redux';
import {Alert} from 'react-native';
import useDeleteAlert from './useDeleteAlert';
import {deleteTickets} from '../../../../redux/actions/closedloop.actions';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('../../../../redux/actions/closedloop.actions', () => ({
  deleteTickets: jest.fn(),
}));

describe('useDeleteAlert Hook', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockReturnValue({id: 123}); // Mock ticket ID
    Alert.alert.mockClear();
  });

  it('should initialize the hook without errors', () => {
    const {result} = renderHook(() => useDeleteAlert());
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current.length).toBe(1); // Ensures it returns an array with a setter function
  });

  it('should call Alert.alert when delete alert is triggered', () => {
    const {result} = renderHook(() => useDeleteAlert());

    act(() => {
      result.current[0](true); // Setting delete alert visibility to true
    });

    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete ticket No. #123',
      'Would you like to delete this ticket?',
      expect.any(Array), // Ensures an array of actions is passed
      {cancelable: true},
    );
  });

  it('should call deleteTickets action when Delete is pressed', () => {
    const {result} = renderHook(() => useDeleteAlert());

    act(() => {
      result.current[0](true);
    });

    // Extract the delete button action from the alert
    const deleteButton = Alert.alert.mock.calls[0][2][0]; // First option (Delete)

    act(() => {
      deleteButton.onPress(); // Simulating delete button press
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      deleteTickets({ticketIds: [123]}),
    );
  });

  it('should close alert when Cancel is pressed', () => {
    const {result} = renderHook(() => useDeleteAlert());

    act(() => {
      result.current[0](true);
    });

    // Extract the cancel button action from the alert
    const cancelButton = Alert.alert.mock.calls[0][2][1]; // Second option (Cancel)

    act(() => {
      cancelButton.onPress(); // Simulating cancel button press
    });

    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(dispatchMock).not.toHaveBeenCalled(); // Ensure deleteTickets was not dispatched
  });
});
