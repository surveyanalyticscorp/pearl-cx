import {renderHook, act} from '@testing-library/react-hooks';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTicketSync from '../useTicketSync';

// Mock the dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('useTicketSync', () => {
  const mockDispatch = jest.fn();
  const mockSyncTickets = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    useDispatch.mockReturnValue(mockDispatch);
    mockDispatch.mockImplementation(action => {
      if (action.type === 'SYNC_TICKETS') {
        return mockSyncTickets();
      }
      return Promise.resolve();
    });

    // Default selector mock
    useSelector.mockImplementation(selector => {
      if (selector.toString().includes('authToken')) {
        return 'mock-auth-token';
      }
      if (selector.toString().includes('ticketSync')) {
        return true;
      }
      if (selector.toString().includes('userInfo')) {
        return {
          feedbackApiKey: 'mock-api-key',
          feedbackID: 'mock-feedback-id',
        };
      }
      return null;
    });

    // Setup global variables
    global.subscriberId = 'mock-subscriber-id';
    global.clfBaseUrl = 'mock-clf-url';
  });

  test('should initialize with default values', () => {
    const {result} = renderHook(() => useTicketSync());

    expect(result.current.hasTicketToSync).toBe(true);
    expect(result.current.isSyncing).toBe(false);
    expect(result.current.syncError).toBe(null);
    expect(result.current.persistedSyncStatus).toBe(null);
  });

  test('should not sync when persisted status is false', async () => {
    AsyncStorage.getItem.mockResolvedValue('false');

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result.current.persistedSyncStatus).toBe(false);
  });

  test('should sync when persisted status is true', async () => {
    AsyncStorage.getItem.mockResolvedValue('true');
    mockSyncTickets.mockResolvedValue({success: true});

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  test('should handle missing required data', async () => {
    global.subscriberId = null;

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result.current.syncError).toBe(null);
  });

  test('should handle sync success and update persisted status', async () => {
    AsyncStorage.getItem.mockResolvedValue('true');
    mockSyncTickets.mockResolvedValue({success: true});

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@ticket_sync_status',
      'true',
    );
    expect(result.current.persistedSyncStatus).toBe(true);
  });

  test('should handle sync failure and update persisted status', async () => {
    AsyncStorage.getItem.mockResolvedValue('true');
    mockSyncTickets.mockRejectedValue(new Error('Sync failed'));

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@ticket_sync_status',
      'false',
    );
    expect(result.current.persistedSyncStatus).toBe(false);
    expect(result.current.syncError).toBeTruthy();
  });

  test('should handle AsyncStorage errors gracefully', async () => {
    AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(result.current.syncError).toBeTruthy();
  });

  test('should set isSyncing state correctly during sync process', async () => {
    AsyncStorage.getItem.mockResolvedValue('true');

    // Create a promise that we can resolve manually
    let resolveSync;
    const syncPromise = new Promise(resolve => {
      resolveSync = resolve;
    });

    mockSyncTickets.mockImplementation(() => syncPromise);

    const {result} = renderHook(() => useTicketSync());

    let syncCallPromise;
    await act(async () => {
      syncCallPromise = result.current.callTicketSync();
    });

    // Verify isSyncing is true during the sync
    expect(result.current.isSyncing).toBe(true);

    // Resolve the sync
    await act(async () => {
      resolveSync();
      await syncCallPromise;
    });

    // Verify isSyncing is false after sync completes
    expect(result.current.isSyncing).toBe(false);
  });

  test('should not sync when hasTicketToSync is false', async () => {
    useSelector.mockImplementation(selector => {
      if (selector.toString().includes('ticketSync')) {
        return false;
      }
      return true;
    });

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test('should handle null persisted status as allowed to sync', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    mockSyncTickets.mockResolvedValue({success: true});

    const {result} = renderHook(() => useTicketSync());

    await act(async () => {
      await result.current.callTicketSync();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(result.current.persistedSyncStatus).toBe(true);
  });
});
