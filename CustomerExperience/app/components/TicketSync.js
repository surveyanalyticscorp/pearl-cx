import React from 'react';
import {View} from 'react-native';
import useTicketSync from '../hooks/useTicketSync';

const TicketSync = () => {
  console.log('TicketSync Rendered');
  useTicketSync();

  return <View testID="ticket-sync-view" />;
};

export default TicketSync;
