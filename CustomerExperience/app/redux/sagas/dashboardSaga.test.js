import {runSaga} from 'redux-saga';
import {takeLatest} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
  fetchDashboard,
  fetchDataCount,
  postApploginCount,
  getCLFBaseURL,
  fetchGlobalSettings,
  watchGetDashboard,
  watchDataCount,
  watchApploginCount,
  watchGetCLFBaseUrl,
  watchGetGlobalSettings,
} from './dashboardSaga';
import {
  DASHBOARD_RECEIVED,
  GET_DASHBOARD,
  GET_WELCOME_SCREEN_DATA,
  APP_LOGIN_COUNTER,
  GET_CLF_BASE_URL,
  SET_TOKEN_EXPIRED,
  WELCOME_SCREEN_DATA_RECIEVED,
} from '../actions/dashboard.actions';
import {
  API_ERROR,
  IS_LOADING,
  SET_GLOBAL_SETTINGS,
  SET_GLOBAL_SETTINGS_RESPONSE,
  WANT_TO_RELOAD_DASHBOARD,
} from '../actions/index';

jest.mock('../../api/WebServiceHandler');
jest.mock('../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
}));
jest.mock('../../Utils/ApiCallUtils', () => ({
  getBearerToken: jest.fn(() => 'bearer'),
  getBearerTokenStatic: jest.fn(() => 'bearer-static'),
  getClfUrl: jest.fn(path => `clf://${path}`),
}));

const run = async (saga, action) => {
  const dispatched = [];
  await runSaga(
    {dispatch: a => dispatched.push(a), getState: () => ({})},
    saga,
    action,
  ).toPromise();
  return dispatched;
};

describe('dashboardSaga', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('fetchDashboard', () => {
    it('dispatches DASHBOARD_RECEIVED on success', async () => {
      const json = {body: {storeNPSList: [], languageCode: 'en'}};
      const clfData = {tickets: []};
      WebServiceHandler.postNew.mockResolvedValueOnce(json);
      WebServiceHandler.get.mockResolvedValueOnce(clfData);

      const action = {token: 'tok', param: {}, segmentId: 1};
      const dispatched = await run(fetchDashboard, action);

      expect(dispatched.some(a => a.type === DASHBOARD_RECEIVED)).toBe(true);
    });

    it('dispatches API_ERROR on failure', async () => {
      WebServiceHandler.postNew.mockRejectedValueOnce({errorAlert: 'err'});

      const action = {token: 'tok', param: {}, segmentId: 1};
      const dispatched = await run(fetchDashboard, action);

      expect(dispatched.some(a => a.type === API_ERROR)).toBe(true);
    });
  });

  describe('fetchDataCount', () => {
    it('dispatches IS_LOADING and WELCOME_SCREEN_DATA_RECIEVED on success', async () => {
      const clf = {counts: []};
      const cx = {data: []};
      WebServiceHandler.get.mockResolvedValueOnce(clf);
      WebServiceHandler.postNew.mockResolvedValueOnce(cx);

      const action = {token: 'tok', param: {}};
      const dispatched = await run(fetchDataCount, action);

      expect(dispatched.some(a => a.type === IS_LOADING && a.payload?.isLoading === true)).toBe(true);
      expect(dispatched.some(a => a.type === WELCOME_SCREEN_DATA_RECIEVED)).toBe(true);
      expect(dispatched.some(a => a.type === IS_LOADING && a.payload?.isLoading === false)).toBe(true);
    });

    it('dispatches SET_TOKEN_EXPIRED on jwt expired error', async () => {
      WebServiceHandler.get.mockRejectedValueOnce({message: 'jwt expired token', code: 'jwt expired'});

      const action = {token: 'tok', param: {}};
      const dispatched = await run(fetchDataCount, action);

      expect(dispatched.some(a => a.type === SET_TOKEN_EXPIRED)).toBe(true);
    });

    it('dispatches API_ERROR on generic error', async () => {
      WebServiceHandler.get.mockRejectedValueOnce({message: 'generic error'});

      const action = {token: 'tok', param: {}};
      const dispatched = await run(fetchDataCount, action);

      expect(dispatched.some(a => a.type === API_ERROR)).toBe(true);
    });
  });

  describe('postApploginCount', () => {
    it('makes POST request without dispatching on success', async () => {
      WebServiceHandler.postNew.mockResolvedValueOnce({});

      const action = {param: {}};
      const dispatched = await run(postApploginCount, action);

      expect(WebServiceHandler.postNew).toHaveBeenCalled();
      expect(dispatched).toHaveLength(0);
    });

    it('dispatches SET_TOKEN_EXPIRED on jwt expired error', async () => {
      WebServiceHandler.postNew.mockRejectedValueOnce({message: 'jwt expired token', code: 'jwt expired'});

      const action = {param: {}};
      const dispatched = await run(postApploginCount, action);

      expect(dispatched.some(a => a.type === SET_TOKEN_EXPIRED)).toBe(true);
    });

    it('dispatches API_ERROR on generic error', async () => {
      WebServiceHandler.postNew.mockRejectedValueOnce({message: 'err'});

      const action = {param: {}};
      const dispatched = await run(postApploginCount, action);

      expect(dispatched.some(a => a.type === API_ERROR)).toBe(true);
    });
  });

  describe('getCLFBaseURL', () => {
    it('makes GET request on success', async () => {
      WebServiceHandler.get.mockResolvedValueOnce({baseUrl: 'http://clf'});

      const action = {token: 'tok', param: {}};
      const dispatched = await run(getCLFBaseURL, action);

      expect(WebServiceHandler.get).toHaveBeenCalled();
    });

    it('dispatches API_ERROR on failure', async () => {
      WebServiceHandler.get.mockRejectedValueOnce({errorAlert: 'err'});

      const action = {token: 'tok', param: {}};
      const dispatched = await run(getCLFBaseURL, action);

      expect(dispatched.some(a => a.type === API_ERROR)).toBe(true);
    });
  });

  describe('fetchGlobalSettings', () => {
    it('dispatches SET_GLOBAL_SETTINGS_RESPONSE on success', async () => {
      WebServiceHandler.get.mockResolvedValueOnce({data: {theme: 'dark'}});

      const dispatched = await run(fetchGlobalSettings, {});

      expect(dispatched.some(a => a.type === SET_GLOBAL_SETTINGS_RESPONSE)).toBe(true);
    });

    it('dispatches API_ERROR on failure', async () => {
      WebServiceHandler.get.mockRejectedValueOnce({errorAlert: 'err'});

      const dispatched = await run(fetchGlobalSettings, {});

      expect(dispatched.some(a => a.type === API_ERROR)).toBe(true);
    });
  });

  describe('fetchDashboard — extra dispatches', () => {
    it('dispatches WANT_TO_RELOAD_DASHBOARD and SET_LANGUAGE_INFO on success', async () => {
      const json = {body: {storeNPSList: [], languageCode: 'en'}};
      const clfData = {tickets: []};
      WebServiceHandler.postNew.mockResolvedValueOnce(json);
      WebServiceHandler.get.mockResolvedValueOnce(clfData);

      const action = {token: 'tok', param: {}, segmentId: 1};
      const dispatched = await run(fetchDashboard, action);

      expect(dispatched.some(a => a.type === WANT_TO_RELOAD_DASHBOARD)).toBe(true);
      expect(dispatched.some(a => a.type === 'SET_LANGUAGE_INFO')).toBe(true);
    });
  });

  describe('watcher sagas', () => {
    it('watchGetDashboard watches GET_DASHBOARD with fetchDashboard', () => {
      const gen = watchGetDashboard();
      expect(gen.next().value).toEqual(takeLatest(GET_DASHBOARD, fetchDashboard));
    });

    it('watchDataCount watches GET_WELCOME_SCREEN_DATA with fetchDataCount', () => {
      const gen = watchDataCount();
      expect(gen.next().value).toEqual(takeLatest(GET_WELCOME_SCREEN_DATA, fetchDataCount));
    });

    it('watchApploginCount watches APP_LOGIN_COUNTER with postApploginCount', () => {
      const gen = watchApploginCount();
      expect(gen.next().value).toEqual(takeLatest(APP_LOGIN_COUNTER, postApploginCount));
    });

    it('watchGetCLFBaseUrl watches GET_CLF_BASE_URL with getCLFBaseURL', () => {
      const gen = watchGetCLFBaseUrl();
      expect(gen.next().value).toEqual(takeLatest(GET_CLF_BASE_URL, getCLFBaseURL));
    });

    it('watchGetGlobalSettings watches SET_GLOBAL_SETTINGS with fetchGlobalSettings', () => {
      const gen = watchGetGlobalSettings();
      expect(gen.next().value).toEqual(takeLatest(SET_GLOBAL_SETTINGS, fetchGlobalSettings));
    });
  });
});
