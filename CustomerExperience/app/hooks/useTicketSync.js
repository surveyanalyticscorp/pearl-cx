import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {syncTickets} from '../redux/actions/closedloop.actions';
import StringUtils from '../Utils/StringUtils';

const TICKET_SYNC_STORAGE_KEY = '@ticket_sync_status';

/**
 * Custom hook for handling ticket synchronization
 * @returns {Object} Object containing sync state and methods
 * @property {boolean} hasTicketToSync - Whether there are tickets to sync
 * @property {Function} callTicketSync - Function to manually trigger ticket sync
 * @property {boolean} isSyncing - Whether sync is currently in progress
 * @property {Error|null} syncError - Any error that occurred during sync
 */
const useTicketSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [persistedSyncStatus, setPersistedSyncStatus] = useState(null);

  const authToken = useSelector(state => state.global.authToken);
  const hasTicketToSync = useSelector(state => state.dashboard.ticketSync);
  const {feedbackApiKey, feedbackID} = useSelector(
    state => state.global.userInfo,
  );
  const dispatch = useDispatch();

  const checkPersistedSyncStatus = useCallback(async () => {
    try {
      const status = await AsyncStorage.getItem(TICKET_SYNC_STORAGE_KEY);
      if (status === null) {
        setPersistedSyncStatus(null);
        return null;
      }
      const parsedStatus = status === 'true';
      setPersistedSyncStatus(parsedStatus);
      return parsedStatus;
    } catch (error) {
      console.error('Error checking persisted sync status:', error);
      setSyncError(error);
      return null;
    }
  }, []);

  const saveSyncStatus = useCallback(async status => {
    try {
      await AsyncStorage.setItem(TICKET_SYNC_STORAGE_KEY, status.toString());
      setPersistedSyncStatus(status);
    } catch (error) {
      console.error('Error saving sync status:', error);
      setSyncError(error);
    }
  }, []);

  const hasValidDataToSyncTickets = useCallback(() => {
    try {
      return (
        !StringUtils.isEmptyOrNull(global.subscriberId) &&
        !StringUtils.isEmptyOrNull(global.clfBaseUrl) &&
        !StringUtils.isEmptyOrNull(feedbackApiKey) &&
        !StringUtils.isEmptyOrNull(feedbackID)
      );
    } catch (error) {
      console.error('Error validating sync data:', error);
      setSyncError(error);
      return false;
    }
  }, [feedbackApiKey, feedbackID]);

  const callTicketSync = useCallback(async () => {
    // Check persisted status first
    const status = await checkPersistedSyncStatus();
    if (status === false) {
      console.log('Sync is disabled based on persisted status');
      return;
    }

    if (!hasValidDataToSyncTickets()) {
      console.warn('Cannot sync tickets: Missing required data');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    console.log('GET_TICKET_LIST_SYNC_RECEIVED: ', 'dispatched');
    try {
      await dispatch(
        syncTickets({
          authToken,
          param: {
            subscriberId: global.subscriberId,
            feedbackApiKey,
          },
          feedbackID,
        }),
      );
      // Save successful sync status
      await saveSyncStatus(true);
    } catch (error) {
      console.error('Error syncing tickets:', error);
      setSyncError(error);
      // Save failed sync status
      await saveSyncStatus(false);
    } finally {
      setIsSyncing(false);
    }
  }, [
    authToken,
    feedbackApiKey,
    feedbackID,
    dispatch,
    hasValidDataToSyncTickets,
    checkPersistedSyncStatus,
    saveSyncStatus,
  ]);

  useEffect(() => {
    if (hasTicketToSync && hasValidDataToSyncTickets()) {
      console.log(
        'TICKET_SYNC',
        global.subscriberId,
        feedbackApiKey,
        feedbackID,
      );
      callTicketSync();
    }
  }, [
    callTicketSync,
    feedbackApiKey,
    feedbackID,
    hasTicketToSync,
    hasValidDataToSyncTickets,
  ]);

  return {
    hasTicketToSync,
    callTicketSync,
    isSyncing,
    syncError,
    persistedSyncStatus,
  };
};

export default useTicketSync;
