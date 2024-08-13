// import {put, takeLatest} from 'redux-saga/effects';
// import {fetchDashboard, watchGetDashboard} from '../redux/sagas/dashboardSaga';
// import {
//   DASHBOARD_RECEIVED,
//   GET_DASHBOARD,
// } from '../redux/actions/dashboard.actions';

// const mockResponse = {
//   detractorTicketsCount: {new: 63, pending: 4, resolved: 4, totalTickets: 71},
//   primaryStoreId: 40305,
//   primaryStoreNPS: {
//     benchmarkScore: 0,
//     detractorFormattedPercent: 0,
//     detractorPercent: 0,
//     detractors: 0,
//     npsPercentage: 100,
//     npsScore: 100,
//     passive: 0,
//     passiveFormattedPercent: 0,
//     passivePercent: 0,
//     promoterFormattedPercent: 100,
//     promoterPercent: 100,
//     promoters: 1,
//     smartTotalResponses: '1',
//     totalResponses: 1,
//   },

//   primaryStoreName: 'Delhi',
//   productNPSList: [
//     {
//       NPSScore: {
//         benchmarkScore: 0,
//         detractorFormattedPercent: 0,
//         detractorPercent: 0,
//         detractors: 0,
//         npsPercentage: 100,
//         npsScore: 100,
//         passive: 0,
//         passiveFormattedPercent: 0,
//         passivePercent: 0,
//         promoterFormattedPercent: 100,
//         promoterPercent: 100,
//         promoters: 1,
//         smartTotalResponses: '1',
//         totalResponses: 1,
//       },
//       filterName: '38270',
//       productName: {name: '38270', id: 2405},
//     },
//     {
//       NPSScore: {
//         benchmarkScore: 0,
//         detractorFormattedPercent: 0,
//         detractorPercent: 0,
//         detractors: 0,
//         npsPercentage: 100,
//         npsScore: 100,
//         passive: 0,
//         passiveFormattedPercent: 0,
//         passivePercent: 0,
//         promoterFormattedPercent: 100,
//         promoterPercent: 100,
//         promoters: 1,
//         smartTotalResponses: '1',
//         totalResponses: 1,
//       },
//       filterName: '38820',
//       productName: {name: '38820', id: 2610},
//     },
//   ],
//   storeNPSList: [],
//   systemPreferences: {businessUnitName: 'Business units'},
//   statusCode: 200,
//   uniqueAPICallIdentifier: 0,
// };
// describe('SAGAS', () => {
//   it('should dispatch action "GET_NEWS" ', () => {
//     const generator = watchGetDashboard();

//     expect(generator.next().value).toEqual(
//       takeLatest(GET_DASHBOARD, fetchDashboard),
//     );
//     expect(generator.next().done).toBeTruthy();
//   });

//   it('should dispatch action "DASHBOARD_RECEIVED" with result from fetch News API', () => {
//     const action = {
//       token:
//         'eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIiwidWlkIjoxNzMyOSwicGlkIjoxMDI2NiwiZXhwIjoxNTk3NjU1NjEwLCJpYXQiOjE1OTcwNTA4MTAsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIn0.N5z5pzE3QOO7M6G_QEwVYvlsuoXGM1nAtW_ZpMGcngU',
//     };
//     const generator = fetchDashboard(action);
//     generator.next();
//     expect(generator.next(mockResponse).value).toEqual(
//       put({type: DASHBOARD_RECEIVED, response: mockResponse}),
//     );
//     expect(generator.next().done).toBeTruthy();
//   });
// });

import {runSaga} from 'redux-saga';
import {put, takeLatest} from 'redux-saga/effects';
// import WebServiceHandler from '../../api/WebServiceHandler';
import {
  DASHBOARD_RECEIVED,
  GET_DASHBOARD,
  WELCOME_SCREEN_DATA_RECIEVED,
  GET_WELCOME_SCREEN_DATA,
  APP_LOGIN_COUNTER,
  GET_CLF_BASE_URL,
} from '../redux/actions/dashboard.actions';
import {
  API_ERROR,
  IS_ERROR,
  IS_LOADING,
  SET_LANGUAGE_INFO,
  WANT_TO_RELOAD_DASHBOARD,
} from '../redux/actions';
import {
  fetchDashboard,
  fetchDataCount,
  postApploginCount,
  getCLFBaseURL,
} from '../redux/sagas/dashboardSaga';
import {
  getBearerToken,
  getBearerTokenStatic,
  getClfUrl,
} from '../Utils/ApiCallUtils';
import WebServiceHandler from '../api/WebServiceHandler';
import {showErrorFlashMessage} from '../Utils/Utility';

jest.mock('../api/WebServiceHandler');
jest.mock('../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
}));
jest.mock('../Utils/ApiCallUtils', () => ({
  getBearerTokenStatic: jest.fn(),
  getClfUrl: jest.fn(url => url),
}));

describe('Dashboard Sagas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchDashboard saga - success', async () => {
    const dispatched = [];
    const mockResponse = {body: {storeNPSList: [], languageCode: 'en'}};
    const mockClosedloopData = {};

    WebServiceHandler.postNew.mockResolvedValue(mockResponse);
    WebServiceHandler.get.mockResolvedValue(mockClosedloopData);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchDashboard,
      {
        token: 'dummy-token',
        param: {},
        segmentId: 1,
      },
    ).toPromise();

    expect(dispatched).toEqual([
      {
        type: DASHBOARD_RECEIVED,
        response: mockResponse,
        ticketCount: mockClosedloopData,
        segmentId: 1,
        npsScoreList: [],
      },
      {type: SET_LANGUAGE_INFO, payload: {languageInfo: {languageCode: 'en'}}},
      {type: WANT_TO_RELOAD_DASHBOARD, payload: {wantToReload: false}},
      {type: IS_ERROR, payload: {isError: false}},
    ]);
  });

  it('fetchDashboard saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchDashboard,
      {
        token: 'dummy-token',
        param: {},
        segmentId: 1,
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
  });

  it('fetchDataCount saga - success', async () => {
    const dispatched = [];
    const mockClfResponse = {};
    const mockCxResponse = {};

    WebServiceHandler.get.mockResolvedValue(mockClfResponse);
    WebServiceHandler.postNew.mockResolvedValue(mockCxResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchDataCount,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(dispatched).toEqual([
      {type: IS_LOADING, payload: {isLoading: true}},
      {
        type: WELCOME_SCREEN_DATA_RECIEVED,
        cxResponse: mockCxResponse,
        clfResponse: mockClfResponse,
      },
      {type: IS_LOADING, payload: {isLoading: false}},
    ]);
  });

  it('fetchDataCount saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.get.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      fetchDataCount,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([
      {type: IS_LOADING, payload: {isLoading: true}},
      {type: API_ERROR, error: mockError},
      {type: IS_LOADING, payload: {isLoading: false}},
    ]);
  });

  it('postApploginCount saga - success', async () => {
    const dispatched = [];
    const mockResponse = {};

    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      postApploginCount,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(dispatched).toEqual([]);
  });

  it('postApploginCount saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      postApploginCount,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
  });

  it('getCLFBaseURL saga - success', async () => {
    const dispatched = [];
    const mockResponse = {};

    WebServiceHandler.get.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      getCLFBaseURL,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(dispatched).toEqual([]);
  });

  it('getCLFBaseURL saga - failure', async () => {
    const dispatched = [];
    const mockError = {errorAlert: 'Error occurred'};

    WebServiceHandler.get.mockRejectedValue(mockError);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      getCLFBaseURL,
      {
        token: 'dummy-token',
        param: {},
      },
    ).toPromise();

    expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
  });
});
