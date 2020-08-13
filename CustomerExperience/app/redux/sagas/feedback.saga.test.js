import {fetchFeedback, watchGetFeedback, feedbackAPICall} from './feedbackSaga';
import {put, takeLatest} from 'redux-saga/effects';
import {FEEDBACK_RECEIVED, GET_FEEDBACK, IS_LOADING} from '../actions';

describe('SAGAS', () => {
  it('should dispatch action "GET_FEEDBACK" ', () => {
    const generator = watchGetFeedback();
    expect(generator.next().value).toEqual(
      takeLatest(GET_FEEDBACK, fetchFeedback),
    );
    expect(generator.next().done).toBeTruthy();
  });

  it('should dispatch action "FEEDBACK_RECEIVED" with result from fetch FEEDBACK_RECEIVED', () => {
    const mockResponse = {
      allResponses: [
        {
          activityURL:
            'https://www.questionpro.com/a/showTicketActivityDetails.do?businessUnitID=40305&responseSetID=22173557',
          answerText: '3',

          businessUnitID: 40305,

          businessUnitManagers: [
            {id: 17329, name: 'sa sh'},
            {id: 17975, name: 'saloni shah'},
          ],
          businessUnitName: 'Delhi',

          emailAddress: 'cx-demo+9736@questionpro.com',
          firstName: 'cx',
          lastName: 'demo',
          memberProfileURL:
            'https://www.questionpro.com/a/showMemberProfile.do?panelMemberID=3166515&responseSetID=22173557',
          panelMemberID: 3166515,
          questionID: 62712858,
          responseDataURL:
            'https://www.questionpro.com/a/loadCxResponseAPI.do?surveyID=6227582&responseSetID=22173557',
          responseSetID: 22173557,
          sentiment: 'Detractor',
          surveyID: 6227582,
          surveyTakenDate: 'Aug 03 2020',

          textResultID: 0,
          textResultValue: '',
          ticketID: 2362,
          ticketStatus: 0,
        },
        {
          activityURL:
            'https://www.questionpro.com/a/showTicketActivityDetails.do?businessUnitID=40305&responseSetID=22173801',
          answerText: '3',
          businessUnitID: 40305,
          businessUnitManagers: [
            {name: 'sa sh', id: 17329},
            {name: 'saloni shah', id: 17975},
          ],
          businessUnitName: 'Delhi',
          emailAddress: 'cx-demo+9736@questionpro.com',
          firstName: 'cx',
          lastName: 'demo',
          memberProfileURL:
            'https://www.questionpro.com/a/showMemberProfile.do?panelMemberID=3166515&responseSetID=22173801',
          panelMemberID: 3166515,
          questionID: 62712858,

          responseDataURL:
            'https://www.questionpro.com/a/loadCxResponseAPI.do?surveyID=6227582&responseSetID=22173801',
          responseSetID: 22173801,
          sentiment: 'Detractor',

          surveyID: 6227582,
          surveyTakenDate: 'Aug 03 2020',
          textResultID: 0,
          textResultValue: '',
          ticketID: 2457,
          ticketStatus: 0,
        },
        {
          activityURL:
            'https://www.questionpro.com/a/showTicketActivityDetails.do?businessUnitID=40305&responseSetID=32356662',
          answerText: '3',

          businessUnitID: 40305,
          businessUnitManagers: [
            {name: 'sa sh', id: 17329},
            {name: 'saloni shah', id: 17975},
          ],
          businessUnitName: 'Delhi',
          emailAddress: 'cx-demo+5615@questionpro.com',
          firstName: 'cx',
          lastName: 'demo',
          memberProfileURL:
            'https://www.questionpro.com/a/showMemberProfile.do?panelMemberID=6463659&responseSetID=32356662',
          panelMemberID: 6463659,
          questionID: 62712858,
          responseDataURL:
            'https://www.questionpro.com/a/loadCxResponseAPI.do?surveyID=6227582&responseSetID=32356662',
          responseSetID: 32356662,
          sentiment: 'Detractor',
          surveyID: 6227582,
          surveyTakenDate: 'Aug 03 2020',

          textResultID: 0,
          textResultValue: '',
          ticketID: 37172,
          ticketStatus: 0,
        },
      ],
      cxTicketStatusValues: [
        {id: -1, text: 'No Ticket Present'},
        {id: 0, text: 'New'},
        {id: 1, text: 'Pending'},
        {id: 2, text: 'Resolved'},
        {id: 5, text: 'Escalated'},
      ],
      statusCode: 200,
      uniqueAPICallIdentifier: 0,
    };

    const action = {
      token:
        'eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIiwidWlkIjoxNzMyOSwicGlkIjoxMDI2NiwiZXhwIjoxNTk3NjU1NjEwLCJpYXQiOjE1OTcwNTA4MTAsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIn0.N5z5pzE3QOO7M6G_QEwVYvlsuoXGM1nAtW_ZpMGcngU',
      param: {month: '8', pageOffset: 0, sentiment: 'All', year: '2020'},
    };
    const generator = feedbackAPICall(action);
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({type: FEEDBACK_RECEIVED, response: mockResponse}),
    );
    expect(generator.next().done).toBeTruthy();
  });
});
