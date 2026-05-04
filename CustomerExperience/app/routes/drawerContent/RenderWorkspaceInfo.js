import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {Colors} from '../../styles/color.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import ListItemSeparator from '../commonUI/ListItemSeparator';
import {MarginConstants} from '../../styles/margin.constants';
import {VerticalSpaceBox} from '../../widgets/SpaceBox';
const RenderWorkspaceInfo = () => {
  const {emailAddress, firstName, lastName, organizationName} = useSelector(
    state => state.global?.userInfo,
  );
  return (
    <View style={{marginTop: MarginConstants.tab1_2x}}>
      <ListItemSeparator height={1} />
      <VerticalSpaceBox multiplyBy={2} />
      <TextLabel text={organizationName ?? ''} style={styles.workspaceName} />
      <TextLabel text={firstName + ' ' + lastName} style={styles.userInfo} />
      <TextLabel text={emailAddress ?? ''} style={styles.userInfo} />
    </View>
  );
};
export default RenderWorkspaceInfo;

const styles = StyleSheet.create({
  workspaceName: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.accent,
    paddingLeft: PaddingConstants.tab1,
  },
  userInfo: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.accent,
    paddingLeft: PaddingConstants.tab1,
  },
});
