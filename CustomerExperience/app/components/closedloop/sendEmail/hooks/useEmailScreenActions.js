import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  getActionHistoryDetails,
  getActionHistorySummary,
  resetSendEmailResponse,
  resetSendEmailError,
} from '../../../../redux/actions/closedloop.actions';

const useEmailScreenActions = ({ticketId, setBody, richTextRef}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {authToken} = useSelector(state => state.global);
  const {emailSentResponse, emailSendError, emailTemplates} = useSelector(
    state => state.dashboard.emailData);
  const [overlayStatus, setOverlayStatus] = useState(null);
  const [isEmailDraftBottomSheetVisible, setEmailDraftBottomSheetVisible] = useState(false);
  const [isTemplateBottomSheetVisible, setIsTemplateBottomSheetVisible] = useState(false);
  const [isInsertLinkModalVisible, setIsInsertLinkModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getActionHistorySummary(authToken, ticketId));
    dispatch(getActionHistoryDetails(authToken, ticketId));
  }, [dispatch, authToken, ticketId]);

  useEffect(() => {
    if (emailSentResponse?.status === 'success') {
      setOverlayStatus('success');
      const timer = setTimeout(() => {
        dispatch(resetSendEmailResponse()); navigation.goBack();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emailSentResponse, dispatch, navigation]);

  useEffect(() => {
    if (emailSendError) {
      setOverlayStatus('error');
      const timer = setTimeout(() => {
        dispatch(resetSendEmailError()); setOverlayStatus(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emailSendError, dispatch]);

  const closeTemplateBottomSheet = () => { setIsTemplateBottomSheetVisible(false); };
  const handleTemplateSelectAction = item => {
    setBody(state => ({...state, emailBody: item.templateText}));
    richTextRef.current.setContentHTML(item.templateText);
    closeTemplateBottomSheet();
  };
  const setAIEmailDraft = emailBody => {
    setBody(state => ({...state, emailBody: emailBody.body ?? '', subject: emailBody.subject ?? ''}));
    richTextRef.current.setContentHTML(emailBody.body ?? '');
  };
  const insertLinkOnEditor = (title, url) => { richTextRef.current.insertLink(title, url); };
  const onPressTemplate = () => {
    setIsTemplateBottomSheetVisible(true); richTextRef.current.dismissKeyboard();
  };
  const onPressAiButton = () => { setEmailDraftBottomSheetVisible(true); };
  const onCloseAiEmailDraftBottomSheet = () => { setEmailDraftBottomSheetVisible(false); };

  return {
    overlayStatus, emailTemplates, isEmailDraftBottomSheetVisible,
    isTemplateBottomSheetVisible, isInsertLinkModalVisible, setIsInsertLinkModalVisible,
    handleTemplateSelectAction, setAIEmailDraft, insertLinkOnEditor, onPressTemplate,
    onPressAiButton, closeTemplateBottomSheet, onCloseAiEmailDraftBottomSheet,
  };
};
export default useEmailScreenActions;
