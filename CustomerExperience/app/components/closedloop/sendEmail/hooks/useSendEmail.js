import {useCallback} from 'react';
import {Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {sendEmail} from '../../../../redux/actions/closedloop.actions';
import StringUtils from '../../../../Utils/StringUtils';
import {showErrorFlashMessage} from '../../../../Utils/Utility';
import {useEmailEditor} from '../EmailEditorContext';

const useSendEmail = emailBody => {
  const {mediaFileList} = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const {blurEditor} = useEmailEditor();

  const handleSend = useCallback(() => {
    Keyboard.dismiss();
    blurEditor?.();
    const attachments = mediaFileList.map(file => file.id);

    if (StringUtils.isEmpty(emailBody.subject)) {
      showErrorFlashMessage('Empty email subject');
      return;
    }
    if (StringUtils.isEmpty(emailBody.emailBody)) {
      showErrorFlashMessage('Empty email body');
      return;
    }
    dispatch(
      sendEmail('', emailBody.ticketId, {
        ...emailBody,
        attachments,
      }),
    );
  }, [emailBody, mediaFileList, dispatch, blurEditor]);

  return {handleSend};
};

export default useSendEmail;
