import React from 'react';
import {StyleSheet} from 'react-native';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {useSelector} from 'react-redux';

import {FontFamily} from '../../../../styles/font.constants';
import {TextSizes} from '../../../../styles/textsize.constants';
import {Colors} from '../../../../styles/color.constants';
import TextLabel from '../../../../widgets/TextLabel/TextLabel';

const RenderTicketId = () => {
  const id = useSelector(state => state.dashboard.ticket.id);

  return (
    <TextLabel
      style={styles.ticketIdText}
      text={`${translate('ticket_overview.ticket_id')} #${id}`}
    />
  );
};

export default RenderTicketId;

const styles = StyleSheet.create({
  ticketIdText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary2,
    color: Colors.evenDarkerGrey,
  },
});
