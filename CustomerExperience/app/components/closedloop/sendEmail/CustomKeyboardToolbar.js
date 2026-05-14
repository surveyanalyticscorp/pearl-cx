import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RichToolbar, actions} from 'react-native-pell-rich-editor';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {
  MaterialCommunityIcons,
  MaterialIcons,
} from '../../../Utils/IconUtils';

const INSERT_LINK = 'customInsertLink';

const CustomKeyboardToolbar = ({
  toolbarRef,
  richTextfieldRef,
  keyboardHeight,
  handleCustomInsertLink,
}) => {
  const BoldIcon = ({tintColor}) => (
    <MaterialIcons name="format-bold" size={20} color={tintColor} />
  );

  const ItalicIcon = ({tintColor}) => (
    <MaterialIcons name="format-italic" size={20} color={tintColor} />
  );

  const UnderlineIcon = ({tintColor}) => (
    <MaterialIcons name="format-underlined" size={20} color={tintColor} />
  );

  const SetInsertLinkIcon = ({tintColor}) => (
    <MaterialIcons name="insert-link" size={20} color={tintColor} />
  );

  const AlignLeftIcon = ({tintColor}) => (
    <MaterialIcons name="format-align-left" size={20} color={tintColor} />
  );

  const AlignCenterIcon = ({tintColor}) => (
    <MaterialIcons name="format-align-center" size={20} color={tintColor} />
  );

  const AlignRightIcon = ({tintColor}) => (
    <MaterialIcons name="format-align-right" size={20} color={tintColor} />
  );

  const AlignJustifyIcon = ({tintColor}) => (
    <MaterialCommunityIcons
      name="format-align-justify"
      size={20}
      color={tintColor}
    />
  );

  return (
    <View style={{...styles.toolbarContainer, bottom: keyboardHeight}}>
      <RichToolbar
        ref={toolbarRef}
        editor={richTextfieldRef}
        selectedIconTint={Colors.accentLight}
        iconTint={Colors.lightBlack}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.alignFull,
          INSERT_LINK,
        ]}
        iconMap={{
          [actions.setBold]: BoldIcon,
          [actions.setItalic]: ItalicIcon,
          [actions.setUnderline]: UnderlineIcon,
          [INSERT_LINK]: SetInsertLinkIcon,
          [actions.alignLeft]: AlignLeftIcon,
          [actions.alignCenter]: AlignCenterIcon,
          [actions.alignRight]: AlignRightIcon,
          [actions.alignFull]: AlignJustifyIcon,
        }}
        customInsertLink={handleCustomInsertLink}
        style={styles.richToolbar}
      />
    </View>
  );
};

export default CustomKeyboardToolbar;

const styles = StyleSheet.create({
  toolbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  richToolbar: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingBottom: PaddingConstants.halfTab,
    height: MarginConstants.tab1_6x,
    backgroundColor: Colors.settingsBackground,
  },
});
