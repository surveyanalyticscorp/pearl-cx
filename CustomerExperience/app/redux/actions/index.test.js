import {
  showLoading,
  wantToReloadDashboard,
  fillUserInfo,
  setLanguageInfo,
  clearUserInfo,
  clearError,
  setAuthToken,
  setBearerToken,
  setRangeFilter,
  setIsFirstTime,
  setError,
  setUserDetailsForResetPassword,
  setDynamicLink,
  getGlobalSettings,
  IS_LOADING,
  WANT_TO_RELOAD_DASHBOARD,
  FILL_USER_INFO,
  SET_LANGUAGE_INFO,
  CLEAR_USER_INFO,
  CLEAR_API_ERROR,
  SET_AUTH_TOKEN,
  SET_BEARER_TOKEN,
  SET_RANGE_FILTER,
  SET_IS_FIRST_TIME,
  API_ERROR,
  SET_USER_DETAILS_FOR_RESET_PASSWORD,
  SET_DYNAMIC_LINK,
  SET_GLOBAL_SETTINGS,
} from './index';

describe('Global action creators', () => {
  it('showLoading returns correct shape with default', () => {
    expect(showLoading()).toEqual({type: IS_LOADING, payload: {isLoading: true}});
  });

  it('showLoading accepts explicit false', () => {
    expect(showLoading(false)).toEqual({type: IS_LOADING, payload: {isLoading: false}});
  });

  it('wantToReloadDashboard returns correct shape', () => {
    expect(wantToReloadDashboard(true)).toEqual({
      type: WANT_TO_RELOAD_DASHBOARD,
      payload: {wantToReload: true},
    });
  });

  it('fillUserInfo returns correct shape', () => {
    const user = {id: 1, name: 'Alice'};
    expect(fillUserInfo(user)).toEqual({type: FILL_USER_INFO, payload: {userInfo: user}});
  });

  it('setLanguageInfo returns correct shape', () => {
    expect(setLanguageInfo('en')).toEqual({
      type: SET_LANGUAGE_INFO,
      payload: {languageInfo: 'en'},
    });
  });

  it('clearUserInfo returns correct shape', () => {
    expect(clearUserInfo()).toEqual({type: CLEAR_USER_INFO, payload: {}});
  });

  it('clearError returns correct shape with default', () => {
    expect(clearError()).toEqual({type: CLEAR_API_ERROR, payload: {isLoading: true}});
  });

  it('setAuthToken returns correct shape', () => {
    expect(setAuthToken('tok123')).toEqual({
      type: SET_AUTH_TOKEN,
      payload: {authToken: 'tok123'},
    });
  });

  it('setBearerToken returns correct shape', () => {
    expect(setBearerToken('bearer456')).toEqual({
      type: SET_BEARER_TOKEN,
      payload: {bearerToken: 'bearer456'},
    });
  });

  it('setRangeFilter returns correct shape', () => {
    const range = {startDate: '2024-01-01', endDate: '2024-01-31'};
    expect(setRangeFilter(range)).toEqual({type: SET_RANGE_FILTER, range});
  });

  it('setIsFirstTime returns correct shape', () => {
    expect(setIsFirstTime(true)).toEqual({type: SET_IS_FIRST_TIME, isFirstTime: true});
  });

  it('setError returns correct shape', () => {
    const err = {message: 'oops'};
    expect(setError(err)).toEqual({type: API_ERROR, error: err});
  });

  it('setUserDetailsForResetPassword returns correct shape', () => {
    const body = {emailAddress: 'a@b.com', accessCode: 'CODE'};
    expect(setUserDetailsForResetPassword(body)).toEqual({
      type: SET_USER_DETAILS_FOR_RESET_PASSWORD,
      payload: body,
    });
  });

  it('setDynamicLink returns correct shape', () => {
    expect(setDynamicLink('https://example.com')).toEqual({
      type: SET_DYNAMIC_LINK,
      payload: 'https://example.com',
    });
  });

  it('getGlobalSettings returns correct shape', () => {
    expect(getGlobalSettings()).toEqual({type: SET_GLOBAL_SETTINGS});
  });
});
