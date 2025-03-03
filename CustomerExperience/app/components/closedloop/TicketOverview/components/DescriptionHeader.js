import React from 'react';
import TextLabel from '../../../../widgets/TextLabel/TextLabel';
import {Colors} from '../../../../styles/color.constants';
import ticketOverviewStyles from '../ticket.overview.style';

const DescriptionHeader = ({text}) => {
  return (
    <TextLabel
      testID="description-header"
      style={ticketOverviewStyles.descriptionHeader}
      text={text}
      color={Colors.accent}
    />
  );
};

export default DescriptionHeader;
