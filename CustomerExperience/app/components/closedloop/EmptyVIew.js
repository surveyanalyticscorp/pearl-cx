import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';

import EmptyState from '../../../assets/images/empty_state.svg';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {VerticalSpaceBox} from '../../widgets/SpaceBox';
import {PaddingConstants} from '../../styles/padding.constants';
import {baseTextStyles} from '../../styles/text.styles';
export const EmptyView = ({title, subTitle}) => {
  return (
    <View testID={'list-empty-view'} style={[styles.container]}>
      <EmptyState />
      <VerticalSpaceBox multiplyBy={4} />
      <TextLabel style={baseTextStyles.largeRegularText} text={title} />
      <VerticalSpaceBox />
      <TextLabel style={styles.content} text={subTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: Colors.greyBackground,
    paddingHorizontal: PaddingConstants.tab1_6x,
  },

  content: {
    textAlign: 'center',
  },
});
