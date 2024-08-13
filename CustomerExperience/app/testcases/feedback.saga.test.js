// import {fetchFeedback, watchGetFeedback} from '../redux/sagas/feedbackSaga';
// import {put, takeLatest} from 'redux-saga/effects';
// import {
//   FEEDBACK_RECEIVED,
//   GET_FEEDBACK,
// } from '../redux/actions/feedback.actions';

// const mockResponse = {
//   body: {
//     allResponses: [
//       {
//         activityURL:
//           'https://www.questionpro.com/a/showTicketActivityDetails.do?businessUnitID=40305&responseSetID=22173557',
//         answerText: '3',

//         businessUnitID: 40305,

//         businessUnitManagers: [
//           {id: 17329, name: 'sa sh'},
//           {id: 17975, name: 'saloni shah'},
//         ],
//         businessUnitName: 'Delhi',

//         emailAddress: 'cx-demo+9736@questionpro.com',
//         firstName: 'cx',
//         lastName: 'demo',
//         memberProfileURL:
//           'https://www.questionpro.com/a/showMemberProfile.do?panelMemberID=3166515&responseSetID=22173557',
//         panelMemberID: 3166515,
//         questionID: 62712858,
//         responseDataURL:
//           'https://www.questionpro.com/a/loadCxResponseAPI.do?surveyID=6227582&responseSetID=22173557',
//         responseSetID: 22173557,
//         sentiment: 'Detractor',
//         surveyID: 6227582,
//         surveyTakenDate: 'Aug 03 2020',

//         textResultID: 0,
//         textResultValue: '',
//         ticketID: 2362,
//         ticketStatus: 0,
//       },
//       {
//         activityURL:
//           'https://www.questionpro.com/a/showTicketActivityDetails.do?businessUnitID=40305&responseSetID=22173801',
//         answerText: '3',
//         businessUnitID: 40305,
//         businessUnitManagers: [
//           {name: 'sa sh', id: 17329},
//           {name: 'saloni shah', id: 17975},
//         ],
//         businessUnitName: 'Delhi',
//         emailAddress: 'cx-demo+9736@questionpro.com',
//         firstName: 'cx',
//         lastName: 'demo',
//         memberProfileURL:
//           'https://www.questionpro.com/a/showMemberProfile.do?panelMemberID=3166515&responseSetID=22173801',
//         panelMemberID: 3166515,
//         questionID: 62712858,

//         responseDataURL:
//           'https://www.questionpro.com/a/loadCxResponseAPI.do?surveyID=6227582&responseSetID=22173801',
//         responseSetID: 22173801,
//         sentiment: 'Detractor',

//         surveyID: 6227582,
//         surveyTakenDate: 'Aug 03 2020',
//         textResultID: 0,
//         textResultValue: '',
//         ticketID: 2457,
//         ticketStatus: 0,
//       },
//       {
//         activityURL:
//           'https://www.questionpro.com/a/showTicketActivityDetails.do?businessUnitID=40305&responseSetID=32356662',
//         answerText: '3',
//         businessUnitID: 40305,
//         businessUnitManagers: [
//           {name: 'sa sh', id: 17329},
//           {name: 'saloni shah', id: 17975},
//         ],
//         businessUnitName: 'Delhi',
//         emailAddress: 'cx-demo+5615@questionpro.com',
//         firstName: 'cx',
//         lastName: 'demo',
//         memberProfileURL:
//           'https://www.questionpro.com/a/showMemberProfile.do?panelMemberID=6463659&responseSetID=32356662',
//         panelMemberID: 6463659,
//         questionID: 62712858,
//         responseDataURL:
//           'https://www.questionpro.com/a/loadCxResponseAPI.do?surveyID=6227582&responseSetID=32356662',
//         responseSetID: 32356662,
//         sentiment: 'Detractor',
//         surveyID: 6227582,
//         surveyTakenDate: 'Aug 03 2020',

//         textResultID: 0,
//         textResultValue: '',
//         ticketID: 37172,
//         ticketStatus: 0,
//       },
//     ],
//     cxTicketStatusValues: [
//       {id: -1, text: 'No Ticket Present'},
//       {id: 0, text: 'New'},
//       {id: 1, text: 'Pending'},
//       {id: 2, text: 'Resolved'},
//       {id: 5, text: 'Escalated'},
//     ],
//   },
//   statusCode: 200,
//   uniqueAPICallIdentifier: 0,
// };

// describe('SAGAS', () => {
//   it('should dispatch action "GET_FEEDBACK" ', () => {
//     const generator = watchGetFeedback();
//     expect(generator.next().value).toEqual(
//       takeLatest(GET_FEEDBACK, fetchFeedback),
//     );
//     expect(generator.next().done).toBeTruthy();
//   });

//   it('should dispatch action "FEEDBACK_RECEIVED" with result from fetch FEEDBACK_RECEIVED', () => {
//     const action = {
//       token:
//         'eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIiwidWlkIjoxNzMyOSwicGlkIjoxMDI2NiwiZXhwIjoxNTk4MjUyMjk5LCJpYXQiOjE1OTc2NDc0OTksImFsZyI6IkhTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIn0.-KCO6_clV5GUq2gisGx57T1ounHQ5MRbWNEdn_Aurpc',
//       param: {month: '8', pageOffset: 0, sentiment: 'All', year: '2020'},
//     };
//     const generator = fetchFeedback(action);
//     generator.next();
//     expect(generator.next(mockResponse).value).toEqual(
//       put({type: FEEDBACK_RECEIVED, response: mockResponse}),
//     );
//     expect(generator.next().done).toBeTruthy();
//   });
// });

import {runSaga} from 'redux-saga';
import {put, takeLatest} from 'redux-saga/effects';

import {
  API_ERROR,
  IS_ERROR,
  IS_LOADING,
  SET_LANGUAGE_INFO,
  WANT_TO_RELOAD_DASHBOARD,
} from '../redux/actions';
import {
  FETCH_ALL_RESPONSES,
  FETCH_ALL_RESPONSES_RECEIVED,
  GET_PANEL_MEMBER,
  GET_RESPONSE_DETAILS_BY_RESPONSEID,
  GET_RESPONSE_TICKETS,
  GET_RESPONSE_TICKETS_RECEIVED,
  GET_SURVEY_RESPONSE_DETAILS,
  PANEL_MEMBER_RECEIVED,
  RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED,
  SURVEY_RESPONSE_DETAILS_RECEIVED,
} from '../redux/actions/feedback.actions';
import {
  fetchPanelMemberData,
  fetchSurveyResponseDetails,
  fetchResponseTickets,
  fetchResponseByResponseId,
  fetchAllResponses,
} from '../redux/sagas/feedbackSaga';
import WebServiceHandler from '../api/WebServiceHandler';
import {showErrorFlashMessage} from '../Utils/Utility';
import {getBearerTokenStatic, getClfUrl} from '../Utils/ApiCallUtils';

jest.mock('../api/WebServiceHandler');
jest.mock('../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
}));
jest.mock('../Utils/ApiCallUtils', () => ({
  getBearerTokenStatic: jest.fn(),
  getClfUrl: jest.fn(url => url),
}));

describe('Feedback Sagas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchPanelMemberData saga - success', async () => {
    const dispatched = [];
    const mockResponse = {};

    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchPanelMemberData,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(dispatched).toEqual([
      {type: PANEL_MEMBER_RECEIVED, response: mockResponse},
    ]);
  });

  it('fetchPanelMemberData saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchPanelMemberData,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
  });

  it('fetchSurveyResponseDetails saga - success', async () => {
    const dispatched = [];
    const mockResponse = {};

    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchSurveyResponseDetails,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(dispatched).toEqual([
      {type: SURVEY_RESPONSE_DETAILS_RECEIVED, response: mockResponse},
    ]);
  });

  it('fetchSurveyResponseDetails saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchSurveyResponseDetails,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
  });

  it('fetchResponseTickets saga - success', async () => {
    const dispatched = [];
    const mockResponse = {};

    WebServiceHandler.get.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchResponseTickets,
      {
        feedbackId: 'feedback-id',
        responseId: 'response-id',
        param: {},
      },
    ).toPromise();

    expect(dispatched).toEqual([
      {type: GET_RESPONSE_TICKETS_RECEIVED, response: mockResponse},
    ]);
  });

  it('fetchResponseTickets saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.get.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchResponseTickets,
      {
        feedbackId: 'feedback-id',
        responseId: 'response-id',
        param: {},
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
  });

  it('fetchResponseByResponseId saga - success', async () => {
    const dispatched = [];
    const mockResponse = {body: {response: {}}};

    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchResponseByResponseId,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(dispatched).toEqual([
      {
        type: RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED,
        data: mockResponse.body.response,
      },
    ]);
  });

  it('fetchResponseByResponseId saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchResponseByResponseId,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
  });

  it('fetchAllResponses saga - success', async () => {
    const dispatched = [];
    const mockResponse = {body: {allResponses: []}, statusCode: 200};
    const onSuccess = jest.fn();
    const onError = jest.fn();

    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchAllResponses,
      {
        token: 'dummy-token',
        param: {},
        onSuccess,
        onError,
      },
    ).toPromise();

    expect(dispatched).toEqual([
      {type: FETCH_ALL_RESPONSES_RECEIVED, allResponses: [], pageOffset: 0},
    ]);
    expect(onSuccess).toHaveBeenCalledWith({
      statusCode: mockResponse.statusCode,
    });
  });

  it('fetchAllResponses saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};
    const onSuccess = jest.fn();
    const onError = jest.fn();

    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchAllResponses,
      {
        token: 'dummy-token',
        param: {},
        onSuccess,
        onError,
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    expect(onError).toHaveBeenCalledWith({error: mockError});
  });
});
