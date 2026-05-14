import {useState, useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {isObjectEmpty} from '../../../../Utils/Utility';

const useEmailBody = (ticketId, toEmail, richTextRef) => {
  const defaultEmail = useSelector(state => state.dashboard.emailData.defaultTemplate);
  const sampleEmailBody = useMemo(() => ({
    ticketId, subject: '', toEmail, emailBody: '', attachments: [],
  }), [ticketId, toEmail]);
  const [body, setBody] = useState(sampleEmailBody);
  useEffect(() => {
    if (!isObjectEmpty(defaultEmail)) {
      setBody(state => ({...state, emailBody: ''}));
      richTextRef.current.setContentHTML('');
    }
  }, [defaultEmail, richTextRef]);
  const onChangeSubject = text => { setBody(state => ({...state, subject: text})); };
  const onChangeEmailBody = text => { setBody(state => ({...state, emailBody: text})); };
  return {body, setBody, onChangeSubject, onChangeEmailBody};
};
export default useEmailBody;
