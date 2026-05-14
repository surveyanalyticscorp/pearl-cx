import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PaddingConstants} from '../../../styles/padding.constants';
import {EmailBodyTextView} from './AiEmailBodyTextView';
import {QPBottomSheet} from '../../../widgets/QPBottomSheet';
import RefineOptionsSheet from './RefineOptionsSheet';
import RenderAILogo from './RenderAILogo';
import RenderLoadingSpinner from './RenderLoadingSpinner';
import EmailActionBar from './EmailActionBar';
import InsertButton from './InsertButton';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {SafeAreaView} from 'react-native-safe-area-context';
import useEmailDraft from './hooks/useEmailDraft';

const AIEmailDraftModal = ({onClose, setEmailBody}) => {
  const {
    isLoading,
    currentDraft,
    selectedRefineOptions,
    isDropDownOpen,
    onPressInsert,
    onPressRegenerate,
    onPressDropDown,
    onCloseDropDown,
    onSelectDropDownItem,
  } = useEmailDraft({onClose, setEmailBody});

  return (
    <SafeAreaView style={styles.modalBody}>
      <RenderLoadingSpinner isLoading={isLoading} />
      <RenderAILogo />
      <EmailBodyTextView text={currentDraft.body ?? ''} />

      <EmailActionBar
        selectedRefineOptions={selectedRefineOptions}
        onPressDropDown={onPressDropDown}
        isDropDownOpen={isDropDownOpen}
        onPressRegenerate={onPressRegenerate}
      />

      <View style={styles.spacer} />
      <InsertButton onPress={onPressInsert} />
      <VerticalSpaceBox multiplyBy={2} />
      <QPBottomSheet
        bottomSheetHeight="80%"
        visible={isDropDownOpen}
        onClose={onCloseDropDown}>
        <RefineOptionsSheet
          selectedItem={selectedRefineOptions}
          onSelectItem={onSelectDropDownItem}
          onClose={onCloseDropDown}
        />
      </QPBottomSheet>
    </SafeAreaView>
  );
};

export default AIEmailDraftModal;

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    padding: PaddingConstants.tab1_2x,
  },
  spacer: {
    flex: 1,
  },
});
