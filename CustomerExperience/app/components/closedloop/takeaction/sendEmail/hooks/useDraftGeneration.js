import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import StringUtils from '../../../../../Utils/StringUtils';
import {
  generateEmailDraft,
  generateRefineEmailDraft,
} from '../../../../../redux/actions/closedloop.actions';

const useDraftGeneration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDraft, setCurrentDraft] = useState({});
  const [drafts, setDrafts] = useState({});

  const {response, context} = useSelector(
    state => state.dashboard.generatedEmailDraftResponse,
  );
  const customerName = useSelector(
    state => state.dashboard?.ticket?.panelMember?.name,
  );
  const ticketId = useSelector(state => state.dashboard?.ticket?.id);
  const {feedbackID} = useSelector(state => state.global.userInfo);
  const dispatch = useDispatch();

  const getEmailDraft = () => {
    setIsLoading(true);
    dispatch(
      generateEmailDraft(
        {customerName: customerName ?? ''},
        ticketId,
        feedbackID,
      ),
    );
  };

  const getRefinedEmailDraft = (item, context_, subject, body) => {
    setIsLoading(true);
    dispatch(
      generateRefineEmailDraft({
        refine: StringUtils.toSnakeCase(item.refine),
        intent: StringUtils.toSnakeCase(item.intent),
        context: context_,
        subject: subject,
        body: body,
      }),
    );
  };

  useEffect(() => {
    setIsLoading(false);
    if (context && response) {
      setCurrentDraft(response);
      setDrafts(state => ({...state, [response.refine]: response}));
    }
  }, [context, response]);

  useEffect(() => {
    getEmailDraft();
  }, []);

  return {isLoading, currentDraft, context, drafts, getEmailDraft, getRefinedEmailDraft};
};

export default useDraftGeneration;
