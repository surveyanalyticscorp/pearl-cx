import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {PaddingConstants} from '../../../../styles/padding.constants';
import TextLabel from '../../../../widgets/TextLabel/TextLabel';

import {Colors} from '../../../../styles/color.constants';
import {baseTextStyles} from '../../../../styles/text.styles';
const TicketDetailsTitle = () => {
  const ticketId = useSelector(state => state.dashboard.ticket.id);

  if (ticketId == null) {
    return (
      <TextLabel
        style={baseTextStyles.largeRegularText}
        color={Colors.white}
        text={'Ticket details'}
      />
    );
  }
  return (
    <View testID="copy-ticket-id-title-button" style={styles.container}>
      <TextLabel
        style={baseTextStyles.largeRegularText}
        color={Colors.white}
        text={`Ticket #${ticketId}`}
      />
    </View>
  );
};

export default TicketDetailsTitle;

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: PaddingConstants.halfTab,
  },
};
