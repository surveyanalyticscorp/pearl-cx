import React, {useCallback} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Colors} from '../../../../styles/color.constants';
import {MarginConstants} from '../../../../styles/margin.constants';
import {IonIcon} from '../../../../Utils/IconUtils';
import {useDispatch} from 'react-redux';
import {postUploadFile} from '../../../../redux/actions/closedloop.actions';
import DocumentPicker from 'react-native-document-picker';
export const AttachmentUploadIcon = () => {
  const dispatch = useDispatch();
  const onPressAttachment = useCallback(async () => {
    console.log('Attach items');

    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles],
      });

      console.log(JSON.stringify(response));

      const formData = new FormData();
      formData.append('mediaType', '1');
      formData.append('file', {
        uri: response.uri,
        type: response.type,
        name: response.name,
      });
      dispatch(postUploadFile(formData));
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <Pressable
      testID="attachment-upload-button"
      onPress={onPressAttachment}
      style={styles.optionIcon}>
      <IonIcon
        testID={'attachment-upload-icon'}
        name={'attach'}
        size={24}
        color={Colors.filterIconColor}
      />
    </Pressable>
  );
};

export default AttachmentUploadIcon;

const styles = StyleSheet.create({
  optionIcon: {
    margin: MarginConstants.tab1,
  },
});
