import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {translate} from '../../../Utils/MultilinguaUtils';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {RichEditor} from 'react-native-pell-rich-editor';
import GestureHandleBar from '../../../routes/commonUI/GestureHandleBar';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import RenderHeader from './RenderHeader';
import EmailOptions from './EmailOptions';
import SendEmailTo from './SendEmailTo';
import EmailSubject from './EmailSubject';
import AttachmentView from './AttachmentView';
import ActionHistory from './ActionHistory';
import ActionHistoryItem from './ActionHistoryItem';

const EmailComposerBody = ({
  body,
  richTextRef,
  editorStyle,
  onChangeSubject,
  onChangeEmailBody,
  onPressAiButton,
  onPressTemplate,
}) => {
  return (
    <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={40}>
      <VerticalSpaceBox />
      <GestureHandleBar />
      <VerticalSpaceBox />

      <RenderHeader />
      <VerticalSpaceBox />

      <EmailOptions
        onPressAiButton={onPressAiButton}
        body={body}
        onPressTemplate={onPressTemplate}
      />
      <SendEmailTo />
      <EmailSubject body={body} onChangeSubject={onChangeSubject} />
      <RichEditor
        ref={richTextRef}
        useContainer
        disabled={false}
        initialFocus={false}
        onChange={onChangeEmailBody}
        placeholder={translate('action_email.email_body')}
        placeholderTextColor={Colors.borderColor}
        androidHardwareAccelerationDisabled={true}
        initialHeight={350}
        style={styles.textInput}
        editorStyle={editorStyle}
        setContentHTML={body.emailBody}
      />
      <AttachmentView />
      <ActionHistory>
        <ActionHistoryItem />
      </ActionHistory>
    </KeyboardAwareScrollView>
  );
};

export default EmailComposerBody;

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
});
