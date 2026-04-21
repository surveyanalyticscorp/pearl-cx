import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {ChipItem} from '../../../routes/commonUI/CommonUI';
import {CloseButton} from '../../../routes/commonUI/BottomSheetHeader';
import {textStyles} from '../../../styles/text.styles';
import StringUtils from '../../../Utils/StringUtils';
import ActionButtons from '../../../routes/commonUI/ActionButtons';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {HorizontalSpaceBox, VerticalSpaceBox} from '../../../widgets/SpaceBox';
import QPAIIcon from '../../../../assets/images/qp_ai.svg';
const refines = [
  'professional',
  'empathetic',
  'reassuring',
  'concise',
  'appreciative',
  'shorten',
  'elaborate',
];
const intents = [
  'acknowledge',
  'request information',
  'confirm resolution',
  'follow-up',
];
const TYPE_INTENT = 'INTENT';
const TYPE_REFINE = 'REFINE';

const RefineSection = ({title, type, chips, handleChipPress}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.chipContainer}>
      {chips.map((chip, index) => (
        <ChipItem
          key={chip.name}
          item={chip}
          title={StringUtils.uppercaseFirstCharRestLowercase(chip.name)}
          index={index}
          onPress={() => handleChipPress(type, chip)}
          textStyle={textStyles.chipText}
        />
      ))}
    </View>
  </View>
);

const RefineOptionsSheet = ({selectedItem, onSelectItem, onClose}) => {
  const [localSelected, setLocalSelected] = useState({
    refine: selectedItem?.refine ?? null,
    intent: selectedItem?.intent ?? null,
  });

  const toneChips = refines.slice(0, 5).map(name => ({
    name,
    isChecked: name === localSelected.refine,
  }));

  const lengthChips = refines.slice(5).map(name => ({
    name,
    isChecked: name === localSelected.refine,
  }));

  const intentChips = intents.map(name => ({
    name,
    isChecked: name === localSelected.intent,
  }));

  const handleChipPress = (type, item) => {
    if (type === TYPE_REFINE) {
      setLocalSelected(prev => ({
        ...prev,
        refine: prev.refine === item.name ? null : item.name,
      }));
    } else {
      setLocalSelected(prev => ({
        ...prev,
        intent: prev.intent === item.name ? null : item.name,
      }));
    }
  };

  const onApply = () => {
    onSelectItem(localSelected);
    onClose();
  };

  const onClear = () => {
    setLocalSelected({refine: null, intent: null});
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContainer}>
          <HorizontalSpaceBox />
          <QPAIIcon />
          <Text style={styles.headerText}>Response Assist</Text>
        </View>

        <CloseButton onPressClose={onClose} />
      </View>
      <RefineSection
        title={'Tone'}
        chips={toneChips}
        handleChipPress={handleChipPress}
        type={TYPE_REFINE}
      />
      <RefineSection
        title={'Length'}
        chips={lengthChips}
        handleChipPress={handleChipPress}
        type={TYPE_REFINE}
      />
      <RefineSection
        title={'Intent'}
        chips={intentChips}
        handleChipPress={handleChipPress}
        type={TYPE_INTENT}
      />

      <ListItemSeparator height={1} />
      <VerticalSpaceBox />
      <VerticalSpaceBox />

      <ActionButtons onCancel={onClear} onApply={onApply} />
    </View>
  );
};

export default RefineOptionsSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingBottom: PaddingConstants.tab1_4x,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: PaddingConstants.tab1,
  },
  headerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.extraLargeText,
    color: Colors.filterIconColor,
    padding: PaddingConstants.tab1,
  },
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
    marginBottom: MarginConstants.tab1_2x,
  },
  sectionTitle: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PaddingConstants.halfTab,
  },
});
