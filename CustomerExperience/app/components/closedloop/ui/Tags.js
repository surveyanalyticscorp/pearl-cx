import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {Title} from './ShowTitleAndText';
import {useDispatch} from 'react-redux';
import {
  updateSingleTag,
  updateTags,
} from '../../../redux/actions/closedloop.actions';
import {useNavigation} from '@react-navigation/native';

const TagItem = ({item, _}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onPress = () => {
    dispatch(updateSingleTag({...item, isChecked: !item.isChecked}));

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  return (
    <Pressable onPress={onPress} style={styles.tag}>
      <TextLabel
        color={Colors.accentLight}
        text={item.name}
        textStyle={styles.text}
      />
    </Pressable>
  );
};

export const Tag = ({tags}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <View style={styles.rootContainer}>
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
