import * as actions from './feedback.actions';
import {
  GET_PANEL_MEMBER,
  PANEL_MEMBER_RECEIVED,
  GET_SURVEY_RESPONSE_DETAILS,
  SURVEY_RESPONSE_DETAILS_RECEIVED,
  GET_RESPONSE_DETAILS_BY_RESPONSEID,
  RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED,
  SET_RESPONSE_READ_LIST,
  ADD_TO_RESPONSE_READ_LIST,
  SET_ALL_RESPONSES,
  SET_ALL_RESPONSES_EMPTY,
  FETCH_ALL_RESPONSES,
  FETCH_ALL_RESPONSES_RECEIVED,
  CLEAR_ALL_RESPONSE_DATA,
  GET_RESPONSE_TICKETS,
  GET_RESPONSE_TICKETS_RECEIVED,
  IS_RESPONSE_LIST_LOADING,
} from './feedback.actions';

describe('Feedback Actions', () => {
  it('should create an action to get panel member details', () => {
    const token = 'token123';
    const param = {some: 'param'};
    const expectedAction = {
      type: GET_PANEL_MEMBER,
      token,
      param,
    };
    expect(actions.getPanelMemberDetails(token, param)).toEqual(expectedAction);
  });

  it('should create an action to get survey response details', () => {
    const token = 'token123';
    const param = {some: 'param'};
    const expectedAction = {
      type: GET_SURVEY_RESPONSE_DETAILS,
      token,
      param,
    };
    expect(actions.getSurveyResponseDetails(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get response tickets', () => {
    const token = 'token123';
    const feedbackId = 'feedback123';
    const responseId = 'response123';
    const param = {some: 'param'};
    const expectedAction = {
      type: GET_RESPONSE_TICKETS,
      token,
      feedbackId,
      responseId,
      param,
    };
    expect(
      actions.getResponseTickets(token, feedbackId, responseId, param),
    ).toEqual(expectedAction);
  });

  it('should create an action to clear response data', () => {
    const expectedAction = {
      type: CLEAR_ALL_RESPONSE_DATA,
    };
    expect(actions.clearResponseData()).toEqual(expectedAction);
  });

  it('should create an action to get response details by response ID', () => {
    const token = 'token123';
    const param = {some: 'param'};
    const expectedAction = {
      type: GET_RESPONSE_DETAILS_BY_RESPONSEID,
      token,
      param,
    };
    expect(actions.getResponseDetailsByResponseId(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set response read list', () => {
    const responseReadList = ['response1', 'response2'];
    const expectedAction = {
      type: SET_RESPONSE_READ_LIST,
      responseReadList,
    };
    expect(actions.setResponseReadList(responseReadList)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to add to response read list', () => {
    const responseSetID = 'response123';
    const expectedAction = {
      type: ADD_TO_RESPONSE_READ_LIST,
      responseSetID,
    };
    expect(actions.addToResponseReadList(responseSetID)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to fetch all responses', () => {
    const token = 'token123';
    const param = {some: 'param'};
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const expectedAction = {
      type: FETCH_ALL_RESPONSES,
      token,
      param,
      onSuccess,
      onError,
    };
    expect(actions.fetchAllResponses(token, param, onSuccess, onError)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set all responses', () => {
    const responses = ['response1', 'response2'];
    const expectedAction = {
      type: SET_ALL_RESPONSES,
      allResponses: responses,
    };
    expect(actions.setAllResponses(responses)).toEqual(expectedAction);
  });

  it('should create an action to set all responses empty', () => {
    const expectedAction = {
      type: SET_ALL_RESPONSES_EMPTY,
    };
    expect(actions.setAllResponsesEmpty()).toEqual(expectedAction);
  });

  it('should create an action to set response list loading', () => {
    const isLoading = true;
    const expectedAction = {
      type: IS_RESPONSE_LIST_LOADING,
      isLoading,
    };
    expect(actions.isResponseLoading(isLoading)).toEqual(expectedAction);
  });
});
