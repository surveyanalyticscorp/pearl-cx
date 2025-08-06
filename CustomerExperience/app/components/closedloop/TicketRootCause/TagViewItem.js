import React from 'react';
import {baseTextStyles} from '../../../styles/text.styles';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';

export const TagViewItem = ({item}) => {
  return (
    <TextLabel
      baseTextStyle={baseTextStyles.semiSecondaryRegularText}
      style={{
        padding: PaddingConstants.tab1,
        backgroundColor: Colors.negativePromter,
      }}
      text={item.name}
    />
  );
};
