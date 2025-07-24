import React from 'react';
import {StyleSheet, View} from 'react-native';
import RenderTicketId from './TicketId';
import TemplateIcon from './TemplateIcon';
import AttachmentUploadIcon from './AttachmentUploadIcon';
import SendIcon from './SendIcon';
import {MarginConstants} from '../../../../styles/margin.constants';
import AiDraftButton from './AiDraftButton';

const EmailOptions = ({onPressAiButton, onPressTemplate, body}) => {
  return (
    <View style={styles.emailOptionContainer}>
      <View style={styles.renderOptionViewStart}>
        <RenderTicketId />
      </View>

      <View style={styles.renderOptionViewEnd}>
        <AiDraftButton onPress={onPressAiButton} />
        <TemplateIcon onPressTemplate={onPressTemplate} />
        <AttachmentUploadIcon />
        <SendIcon emailBody={body} />
      </View>
    </View>
  );
};

export default EmailOptions;
const styles = StyleSheet.create({
  emailOptionContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: MarginConstants.tab1,
    marginBottom: MarginConstants.halfTab,
  },
  renderOptionViewEnd: {
    flex: 2,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  renderOptionViewStart: {
    flex: 2,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
