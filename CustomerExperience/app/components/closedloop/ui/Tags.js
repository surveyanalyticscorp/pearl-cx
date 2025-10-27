import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {CheckBox, CheckBoxItem} from '../../../routes/commonUI/CommonUI';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import DescriptionHeader from '../TicketOverview/components/DescriptionHeader';
import {Title} from './ShowTitleAndText';

const TagItem = ({item, index}) => {
  return (
    <View style={styles.tag}>
      <TextLabel
        color={Colors.accentLight}
        text={item.name}
        textStyle={styles.text}
      />
    </View>
  );
};

export const Tag = ({tags}) => {
  return (
    // <View style={styles.rootContainer}>
    <View style={styles.secondaryRootContainer}>
      {/* <DescriptionHeader text={'AI generated tags'} /> */}
      <Title text={`AI generated tags`} />
      <VerticalSpaceBox />
      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <TagItem key={'tag-' + index + tag.id} item={tag} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',

    justifyContent: 'flex-start',
    marginHorizontal: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
    marginBottom: MarginConstants.halfTab,
    padding: PaddingConstants.tab1_2x,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  secondaryRootContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: MarginConstants.tab1_2x,
    marginVertical: MarginConstants.halfTab,
    paddingVertical: PaddingConstants.halfTab,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  tagContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tag: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.accentLightBackground,
    marginEnd: MarginConstants.tab1,
    marginBottom: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1,
    backgroundColor: Colors.accentLightBackground,
  },

  text: {
    color: Colors.accentLight,
    padding: PaddingConstants.tab1_2x,
    ...baseTextStyles.primaryRegularText,
  },
});
