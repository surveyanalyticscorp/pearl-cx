import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {FontFamilyStylesheet} from '../../../config/fonts/StyleSheet';
import EmailEditorContext from './EmailEditorContext';
import EmailComposerBody from './EmailComposerBody';
import EmailTemplateSheet from './EmailTemplateSheet';
import AIEmailDraftSheet from './AIEmailDraftSheet';
import CustomKeyboardToolbar from './CustomKeyboardToolbar';
import InsertLinkModal from './InsertLinkModal';
import EmailSentOverlay from './EmailSentOverlay';
import useEmailBody from './hooks/useEmailBody';
import useKeyboardState from './hooks/useKeyboardState';
import useEmailScreenActions from './hooks/useEmailScreenActions';

export const SendEmail = props => {
  const ticketId = JSON.stringify(props.route.params.ticketId);
  const toEmail = props.route.params.toEmail ?? '';
  const richText = useRef();
  const toolbarRef = useRef();

  const {body, setBody, onChangeSubject, onChangeEmailBody} = useEmailBody(
    ticketId,
    toEmail,
    richText,
  );
  const {isKeyboardVisible, keyboardHeight} = useKeyboardState();
  const {
    overlayStatus,
    emailTemplates,
    isEmailDraftBottomSheetVisible,
    isTemplateBottomSheetVisible,
    isInsertLinkModalVisible,
    setIsInsertLinkModalVisible,
    handleTemplateSelectAction,
    setAIEmailDraft,
    insertLinkOnEditor,
    onPressTemplate,
    onPressAiButton,
    closeTemplateBottomSheet,
    onCloseAiEmailDraftBottomSheet,
  } = useEmailScreenActions({ticketId, setBody, richTextRef: richText});

  const editorStyle = {
    initialCSSText: `${FontFamilyStylesheet}`,
    contentCSSText: 'font-family: Fira Sans',
    backgroundColor: Colors.white,
  };

  return (
    <EmailEditorContext.Provider
      value={{blurEditor: () => richText.current?.dismissKeyboard()}}>
      <SafeAreaView style={styles.container} forceInset={{top: 'never'}}>

        <EmailComposerBody
          body={body}
          richTextRef={richText}
          editorStyle={editorStyle}
          onChangeSubject={onChangeSubject}
          onChangeEmailBody={onChangeEmailBody}
          onPressAiButton={onPressAiButton}
          onPressTemplate={onPressTemplate}
        />

        <EmailTemplateSheet
          visible={isTemplateBottomSheetVisible}
          onClose={closeTemplateBottomSheet}
          emailTemplates={emailTemplates}
          onSelectTemplate={handleTemplateSelectAction}
        />

        <AIEmailDraftSheet
          visible={isEmailDraftBottomSheetVisible}
          onClose={onCloseAiEmailDraftBottomSheet}
          onSetEmailBody={setAIEmailDraft}
        />

        {isKeyboardVisible && (
          <CustomKeyboardToolbar
            keyboardHeight={keyboardHeight}
            toolbarRef={toolbarRef}
            richTextfieldRef={richText}
            handleCustomInsertLink={() => setIsInsertLinkModalVisible(true)}
          />
        )}

        <InsertLinkModal
          setVisiblity={setIsInsertLinkModalVisible}
          isVisible={isInsertLinkModalVisible}
          insertLink={insertLinkOnEditor}
        />

        {overlayStatus !== null && (
          <EmailSentOverlay isSuccess={overlayStatus === 'success'} />
        )}

      </SafeAreaView>
    </EmailEditorContext.Provider>
  );
};

export default SendEmail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'column',
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    paddingTop: PaddingConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1_2x,
  },
});
