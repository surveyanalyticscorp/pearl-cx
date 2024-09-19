import React from 'react';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const NewResponse = () => {
  return (
    <TextLabel
      color={Colors.white}
      style={{
        paddingHorizontal: PaddingConstants.tab1,
        paddingVertical: PaddingConstants.halfTab,
        backgroundColor: Colors.accentLight,
        borderRadius: MarginConstants.tab1,
      }}>
      New
    </TextLabel>
  );
};

export default NewResponse;
