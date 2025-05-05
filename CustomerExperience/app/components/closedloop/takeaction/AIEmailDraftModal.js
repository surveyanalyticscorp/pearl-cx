import React, {useEffect, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {IonIcon} from '../../../Utils/IconUtils';
import {RichEditor} from 'react-native-pell-rich-editor';
import {useSelector} from 'react-redux';
import {AI_ROUTER_API_KEY, AI_ROUTER_API_URL} from '../../../api/Constant';
import {apiHandler} from '../../../api/ApiHandler';
import QPSpinner from '../../../widgets/QPSpinner';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import {MarginConstants} from '../../../styles/margin.constants';
import StringUtils from '../../../Utils/StringUtils';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {set} from 'lodash';

const renderLoadingSpinner = () => {
  return (
    <View style={styles.loading}>
      <QPSpinner spinnerText={'Crafting your email with AI...'} />
    </View>
  );
};

function InsertAndRegenerateButton({onPressInsert, onPressRegenerate}) {
  return (
    <View
      style={{
        margin: MarginConstants.tab1_2x,
        padding: PaddingConstants.tab1_2x,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
      }}>
      <Pressable
        style={{marginEnd: MarginConstants.tab1_4x}}
        onPress={onPressRegenerate}>
        <IonIcon name="refresh" size={32} color={Colors.accentLight} />
      </Pressable>
      <QPButton
        buttonText={'Insert'}
        buttonColor={Colors.accentLight}
        onPress={onPressInsert}
        textStyle={buttonStyles.primaryButtonText}
        style={{
          flexDirection: 'row-reverse',
          ...buttonStyles.primaryButton,
          borderRadius: 2,
        }}
      />
    </View>
  );
}

const RichTextEditor = ({richText, onChangeEmailBody}) => {
  return (
    <RichEditor
      ref={richText}
      useContainer
      disabled={false}
      initialFocus={false}
      onChange={onChangeEmailBody}
      placeholder={'Generating email draft....'}
      placeholderTextColor={Colors.borderColor}
      androidHardwareAccelerationDisabled={true}
      initialHeight={400}
      style={styles.textInput}
      editorStyle={{
        backgroundColor: Colors.transparentBackground,
      }}
    />
  );
};

const ChipButton = ({label, onPress, currentDraftType}) => {
  const isActive = currentDraftType === label;
  const borderColor = isActive ? Colors.accentLight : Colors.filterIconColor;
  const backgroundColor = isActive ? Colors.accentLight : Colors.white;
  const fontColor = isActive ? Colors.white : Colors.filterIconColor;
  const onPressChip = () => {
    onPress(isActive ? 'default' : label);
  };
  return (
    <Pressable
      style={{
        ...styles.chipButton,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
      onPress={onPressChip}>
      <Text style={{...styles.chipButtonText, color: fontColor}}>
        {StringUtils.uppercaseFirstChar(label)}
      </Text>
    </Pressable>
  );
};

const ModalContainer = ({
  children,
  emailDraftModalVisible,
  setEmailDraftModalVisible,
  isLoading,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={emailDraftModalVisible}
      onRequestClose={() => setEmailDraftModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isLoading ? renderLoadingSpinner() : children}
        </View>
      </View>
    </Modal>
  );
};

const AIEmailDraftModal = ({
  emailDraftModalVisible,
  setEmailDraftModalVisible,
  setEmailBody,
}) => {
  const richTextEditor = React.useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [draftType, setDraftType] = useState('default');
  const customerName = useSelector(
    state => state.dashboard?.ticket?.panelMember?.name,
  );
  const [currentDraftBody, setCurrentDraftBody] = useState('');
  const {userInfo} = useSelector(state => state.global);
  const {comment} = useSelector(state => state.dashboard.ticket);

  const onChangeEmailBody = text => {
    console.log('onChangeEmailBody', text);
    setCurrentDraftBody(text);
  };

  const aiRouterAPICall = userPrompt => {
    setIsLoading(true);
    richTextEditor?.current?.setContentHTML('');

    // const extractedTemplates = emailTemplates.map(
    //   ({title, subject, templateText}) => ({
    //     title,
    //     subject,
    //     templateText,
    //   }),
    // );

    // const extractedRootCauses = rootCauseList.map(({title}) => ({
    //   title,
    // }));

    // const extractedActions = rootCauseActions.map(({actionName}) => ({
    //   actionName,
    // }));

    apiHandler.generateEmailWithAI(
      AI_ROUTER_API_URL,
      AI_ROUTER_API_KEY,
      {
        user_id: 4894850,
        use_case_name: 'generate-email-draft-clf',
        prompt_version: 2,
        organization_id: 4787064,
        data_center: 'US',
        meta: {
          id: 1,
        },
        input_data: {
          messages: [
            {
              key: 'content',
              value: 'JSON Draft email for customer',
            },
            {
              key: 'customerName',
              value: customerName,
            },
            {
              key: 'senderName',
              value: userInfo.firstName + '\t' + userInfo.lastName,
            },
            {
              key: 'ticketDetails',
              value: comment,
            },
            {
              key: 'serveyDetails',
              value: null,
            },
            {
              key: 'comments',
              value: userPrompt ?? 'Keep it short and to the point',
            },
          ],
        },
      },
      response => {
        setIsLoading(false);

        console.log('response', response);
        if (
          response?.error === null &&
          response.result.documents[0].output[0].value.statusCode === 200
        ) {
          setDrafts(response.result.documents[0].output[0].value.emailDrafts);
        } else {
          showErrorFlashMessage(
            response?.error?.message ?? "Couldn't generate email",
          );
        }
      },
      error => {
        setIsLoading(false);
        // richText.current.setContentHTML(defaultEmail.templateText);
        // onChangeSubject(defaultEmail.subject);
        // onChangeEmailBody(defaultEmail.templateText);
        // setIsLoading(false);
        console.log('error', error);
        showErrorFlashMessage(error?.message ?? "Couldn't generate email");
      },
    );
  };

  useEffect(() => {
    aiRouterAPICall();
  }, []);

  useEffect(() => {
    if (drafts.length > 0) {
      setTextToEditor();
    }
  }, [drafts, draftType]);

  const setTextToEditor = () => {
    console.log('setTextToEditor', draftType);

    const selectedDraft =
      drafts.find(draft => draft.type === draftType) ?? drafts[0];
    setCurrentDraftBody(selectedDraft.body);
    richTextEditor.current.setContentHTML(selectedDraft.body);
    console.log('setTextToEditor', selectedDraft.type);
  };

  const onPressChip = selected => {
    console.log('onPressChip', selected);
    setDraftType(selected);
  };

  const onPressInsert = () => {
    console.log('onPressInsert', draftType, JSON.stringify(currentDraftBody));
    const selectedDraft =
      drafts.find(draft => draft.type === draftType) ?? drafts[0];
    setEmailBody({
      ...selectedDraft,
      body: currentDraftBody ?? selectedDraft.body,
    });
    setEmailDraftModalVisible(false);
  };
  const onPressRegenerate = () => {
    console.log('onPressRegenerate');
    setCurrentDraftBody('');
    richTextEditor.current.setContentHTML('');
    aiRouterAPICall();
  };
  return (
    <ModalContainer
      emailDraftModalVisible={emailDraftModalVisible}
      setEmailDraftModalVisible={setEmailDraftModalVisible}
      isLoading={isLoading}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalHeaderText}>Email Drafting with AI</Text>
        <Pressable onPress={() => setEmailDraftModalVisible(false)}>
          <IonIcon name="close" size={24} color={Colors.filterIconColor} />
        </Pressable>
      </View>
      <View style={styles.modalBody}>
        {drafts.length > 0 && (
          <RichTextEditor
            richText={richTextEditor}
            onChangeEmailBody={onChangeEmailBody}
          />
        )}
      </View>
      <View style={styles.chipButtonContainer}>
        <ChipButton
          label="formalize"
          onPress={onPressChip}
          currentDraftType={draftType}
        />
        <ChipButton
          label="elaborate"
          onPress={onPressChip}
          currentDraftType={draftType}
        />
        <ChipButton
          label="shorten"
          onPress={onPressChip}
          currentDraftType={draftType}
        />
      </View>
      <InsertAndRegenerateButton
        onPressInsert={onPressInsert}
        onPressRegenerate={onPressRegenerate}
      />
    </ModalContainer>
  );
};

export default AIEmailDraftModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    height: '90%',
    borderRadius: 2,
    width: '90%',
    alignContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1_2x,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  modalHeaderText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.largeText,
    fontFamily: FontFamily.medium,
  },
  modalBody: {
    flex: 1,
    padding: PaddingConstants.tab2,
  },
  modalBodyText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
  },
  chipButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: MarginConstants.tab1_2x,
    padding: PaddingConstants.tab1_2x,
  },
  chipButton: {
    borderRadius: 5,
    padding: PaddingConstants.halfTab,
    marginStart: MarginConstants.tab1,
    marginEnd: MarginConstants.tab1_2x,
    borderWidth: 2,
  },
  chipButtonText: {
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
});
