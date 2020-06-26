import { apiHandler } from '../../global/api/APIHandler';
import feedbackDetails from './FeedbackDetail.json';

export function fetchFeedbacks(data,isLoadingTail) {
  return dispatch => {
      return apiHandler.getCXFeedbackList(dispatch, data,isLoadingTail);
  };
}

export function updateFeedbacks(data) {
  return dispatch => {
      return apiHandler.updateCXFeedbackStatus(dispatch,data)
  };
}

export function setSelectedFeedback(data) {
  return dispatch => {
    dispatch({
      type: 'CX_FEEDBACK_SELECTED',
      data
    })
  }
}

export function fetchFeedbackDetail(id) {
  const detailData = feedbackDetails.find(detailData => detailData.id === id);
  return dispatch => {
    dispatch({
      type: 'CX_FEEDBACK_DETAIL',
      data: detailData
    });
    // TODO For api call
  };
}
