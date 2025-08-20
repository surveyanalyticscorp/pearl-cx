import React from 'react';
import {ScrollView, View} from 'react-native';
import DescriptionHeader from './DescriptionHeader';
import {SubText} from '../../ui/ShowTitleAndText';
import {useSelector} from 'react-redux';
import {PaddingConstants} from '../../../../styles/padding.constants';

export const DescriptionDetails = () => {
  const {comment} = useSelector(state => state.dashboard.ticket);

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: PaddingConstants.tab1,
        paddingHorizontal: PaddingConstants.tab1_2x,
      }}>
      <SubText text={comment} />
    </ScrollView>
  );
};
