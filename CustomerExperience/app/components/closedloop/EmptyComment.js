import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';

import EmptyState from '../../../assets/images/empty_state.svg';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {HorizontalSpaceBox} from '../../widgets/SpaceBox';
import {PaddingConstants} from '../../styles/padding.constants';
import {baseTextStyles} from '../../styles/text.styles';
export const EmptyView = ({title, subTitle}) => {
  return (
    <View testID={'list-empty-view'} style={[styles.container]}>
      <EmptyState />
      <HorizontalSpaceBox />
      <TextLabel style={baseTextStyles.largeRegularText} text={title} />
      <HorizontalSpaceBox />
      <TextLabel text={subTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1_6x,
  },
});
