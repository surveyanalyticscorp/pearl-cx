import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {RenderSpinner} from '../../../../routes/commonUI/CommonUI';
import ticketOverviewStyles from '../ticket.overview.style';

const TicketOverviewContainer = ({children}) => {
  const isLoading = useSelector(state => state.global.isTicketLoading);

  return isLoading ? (
    <View style={ticketOverviewStyles.container}>
      <RenderSpinner />
    </View>
  ) : (
    <View testID="ticket-overview" style={ticketOverviewStyles.container}>
      {children}
    </View>
  );
};

export default TicketOverviewContainer;
