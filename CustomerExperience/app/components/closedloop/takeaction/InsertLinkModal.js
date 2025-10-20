import React from 'react';
import {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {buttonStyles} from '../../../styles/button.styles';

const InsertLinkModal = ({isVisible, setVisiblity, insertLink}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const onSubmit = () => {
    insertLink(title.trim() || url.trim(), url.trim());
    setVisiblity(false);
    setTitle('');
    setUrl('');
  };

  const onCancel = () => {
    setVisiblity(false);
    setTitle('');
    setUrl('');
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onCancel}
      transparent
      animationType="fade">
      <Pressable style={styles.modalBackdrop} onPress={onCancel}>
        <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>Insert Link</Text>
          <View style={styles.modalInputsContainer}>
            <TextInput
              placeholder="Title"
              placeholderTextColor={Colors.borderColor}
              value={title}
              onChangeText={setTitle}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Insert link"
              placeholderTextColor={Colors.borderColor}
              value={url}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={setUrl}
              style={[styles.modalInput, styles.modalInputSpacing]}
            />
          </View>
          <View style={styles.modalActions}>
            <Pressable style={[buttonStyles.textButton]} onPress={onCancel}>
              <Text style={buttonStyles.textButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                buttonStyles.textButton,
                {marginLeft: PaddingConstants.tab1_2x},
              ]}
              onPress={onSubmit}>
              <Text style={[buttonStyles.textButtonTextPrimary]}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default InsertLinkModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dotColor,
    minWidth: 'auto',
    padding: PaddingConstants.tab1_4x,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: PaddingConstants.tab1_2x,
  },
  modalTitle: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderColor: Colors.darkGrey,
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  modalInputsContainer: {
    marginVertical: PaddingConstants.tab1,
  },
  modalInputSpacing: {
    marginTop: PaddingConstants.halfTab,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: MarginConstants.tab1,
  },
});
