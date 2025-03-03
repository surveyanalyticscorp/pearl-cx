import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {deleteTickets} from '../../../../redux/actions/closedloop.actions';

const useDeleteAlert = () => {
  const {id} = useSelector(state => state.dashboard.ticket);
  const [deleteAlertVisibility, setDeleteAlertVisibility] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (deleteAlertVisibility) {
      Alert.alert(
        `Delete ticket No. #${id}`,
        'Would you like to delete this ticket?',
        [
          {
            text: 'Delete',
            onPress: () => {
              console.log('handleOnOk');
              setDeleteAlertVisibility(false);
              dispatch(deleteTickets({ticketIds: [id]}));
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              console.log('handleOnCancel');
              setDeleteAlertVisibility(false);
            },
          },
        ],
        {cancelable: true},
      );
    }
  }, [deleteAlertVisibility, id, dispatch]);

  return [setDeleteAlertVisibility];
};

export default useDeleteAlert;
