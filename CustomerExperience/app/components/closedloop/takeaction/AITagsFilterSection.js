import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateSingleTag} from '../../../redux/actions/closedloop.actions';
import AITagsChipList from './AITagsChipList';

const AITagsFilterSection = ({title, testID}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const aiTags = useSelector(state => state.dashboard.ticketTags);

  const onItemSelect = useCallback((item, index) => {
    dispatch(updateSingleTag({...item, isChecked: !item.isChecked}));
  }, []);

  const navigateToAiTagsModal = () => {
    navigation.navigate('AiTagsFilter');
  };

  const getTags = () => (aiTags ? aiTags.filter(tag => tag.isChecked) : []);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <QPButton
          style={buttonStyles.textButton}
          textStyle={buttonStyles.textButtonTextPrimaryLarge}
          buttonText={getTags().length > 0 ? 'Edit' : 'Select'}
          onPress={navigateToAiTagsModal}
        />
      </View>
      <AITagsChipList
        checkedTags={getTags()}
        onItemSelect={onItemSelect}
        onCountChipPress={navigateToAiTagsModal}
        testID={testID}
      />
    </View>
  );
};

export default AITagsFilterSection;

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
});
