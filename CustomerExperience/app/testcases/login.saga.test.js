// import {put, takeLatest} from 'redux-saga/effects';
// import {doLoginApiCall, watchDoLogin} from '../redux/sagas/loginInSaga';
// import {GET_LOGIN, LOGIN_RESPONSE} from '../redux/actions';

// describe('SAGAS', () => {
//   it('should dispatch action "GET_LOGIN" ', () => {
//     const generator = watchDoLogin();

//     expect(generator.next().value).toEqual(
//       takeLatest(GET_LOGIN, doLoginApiCall),
//     );
//     expect(generator.next().done).toBeTruthy();
//   });

//   it('should dispatch action "LOGIN_RESPONSE" with result from fetch News API', () => {
//     const mockResponse = {
//       authToken:
//         'eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIiwidWlkIjoxNzMyOSwicGlkIjoxMDI2NiwiZXhwIjoxNTk3NDAxMzE3LCJpYXQiOjE1OTY3OTY1MTcsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIn0.jZq2KozQ7bdZhAXOZ07ti0Sp3mz-fFUf22oVPZiNVYI',
//       body: {
//         firstName: 'sa',
//         lastName: 'sh',
//         organizationName: 'Untitled - Company Name',
//       },
//       mainMenu: {
//         menuLinks: [
//           {
//             active: false,
//             name: 'Home',
//             orderNumber: 0,
//             separator: false,
//             title: 'Home',
//             totalResponse: 0,
//             type: 'HOME',
//             url: '/a/nativehtmlhome?app=cx&platform=android',
//           },
//           {
//             active: false,
//             name: 'Logout',
//             orderNumber: 0,
//             separator: true,
//             title: 'Logout',
//             totalResponse: 0,
//             type: 'LOGOUT',
//             url: 'logout',
//           },
//         ],
//         subtitle: 'sa',
//       },
//       statusCode: 200,
//       uniqueAPICallIdentifier: 0,
//     };
//     const action = {
//       param: {
//         accessCode: 'access',
//         emailAddress: 'saloni.shah+20@questionpro.com',
//         password: 'ggguku',
//         platform: 'ios',
//         sourceMode: 'email',
//         udId: '79BDE4CB-F940-416C-81B0-4C7934ADF62B' + '',
//       },
//     };
//     const generator = doLoginApiCall(action);
//     generator.next();

//     expect(generator.next(mockResponse).value).toEqual(
//       put({type: LOGIN_RESPONSE, response: mockResponse}),
//     );
//     expect(generator.next().done).toBeTruthy();
//   });

//   it('throws when a call to GET_LOGIN fails ', () => {
//     const action = {
//       param: {
//         accessCode: '',
//         emailAddress: 'saloni.shah+20@questionpro.com',
//         password: 'ggguku',
//         platform: 'ios',
//         sourceMode: 'email',
//         udId: '79BDE4CB-F940-416C-81B0-4C7934ADF62B' + '',
//       },
//     };

//     const mockResponse = {
//       errorAlert: 'Invalid company code.',
//       statusCode: 400,
//       uniqueAPICallIdentifier: 0,
//       validationErrors: [],
//     };

//     const generator = doLoginApiCall(action);
//     generator.next();
//     expect(generator.next(mockResponse).value).toEqual(
//       put({type: LOGIN_RESPONSE, response: mockResponse}),
//     );
//     expect(generator.next).toThrow(Error);
//   });
// });

import {runSaga} from 'redux-saga';
import {put, takeLatest} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {
  AUTHENTICATE_PANEL,
  AUTHENTICATE_PANEL_RESPONSE,
  GET_LOGIN,
  LOGIN_RESPONSE,
} from '../redux/actions/login.actions';
import {
  doAuthenticatePanel,
  doLoginApiCall,
  watchAuthenticatePanel,
  watchDoLogin,
} from '../redux/sagas/loginInSaga';
import {
  IS_DEV_MODE,
  DEV_BASE_URL,
  INIT_BASE,
  BASE_URL_NEW_MID_FIX,
  PANEL_AUTH,
  AUTH_LOGIN,
  CLF_BASE_URL,
  ASYNC_CLF_BASE_URL,
  CLF_GET_BASE_URL,
  ASYNC_USER_CREDENTIALS,
} from '../api/Constant';
import {showErrorFlashMessage} from '../Utils/Utility';
import {API_ERROR} from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../api/WebServiceHandler');
// jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('../Utils/Utility');
describe('doAuthenticatePanel Saga', () => {
  it('should handle successful authentication', async () => {
    const dispatched = [];
    const action = {type: AUTHENTICATE_PANEL, param: {accessCode: 'clean333'}};
    const mockResponse = {
      uniqueAPICallIdentifier: 0,
      body: {
        panelID: 87202,
        mobileAPIURL: 'https://api.questionpro.com',
        dataCenter: 'US',
        accessCode: 'clean333',
        panelDataSource: 'alt2',
        ID: 6775,
        userID: 4894850,
      },
      statusCode: 200,
    };

    WebServiceHandler.postNew = jest.fn(() => Promise.resolve(mockResponse));

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      doAuthenticatePanel,
      action,
    ).done;

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      `${
        IS_DEV_MODE ? DEV_BASE_URL : INIT_BASE + BASE_URL_NEW_MID_FIX
      }${PANEL_AUTH}`,
      {},
      action.param,
    );

    expect(dispatched).toEqual([
      {
        type: AUTHENTICATE_PANEL_RESPONSE,
        hasMidFix: false,
        response: mockResponse,
      },
    ]);
  });

  it('should handle authentication error', async () => {
    const dispatched = [];
    const action = {type: AUTHENTICATE_PANEL, param: {}};
    const error = {errorAlert: 'some error'};

    WebServiceHandler.postNew.mockRejectedValue(error);
    const showErrorFlashMessageSpy = jest.spyOn(
      require('../Utils/Utility'),
      'showErrorFlashMessage',
    );

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      doAuthenticatePanel,
      action,
    ).done;

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      `${
        IS_DEV_MODE ? DEV_BASE_URL : INIT_BASE + BASE_URL_NEW_MID_FIX
      }${PANEL_AUTH}`,
      {},
      action.param,
    );

    expect(showErrorFlashMessageSpy).toHaveBeenCalledWith(error.errorAlert);

    expect(dispatched).toEqual([
      {
        type: API_ERROR,
        error: error,
      },
    ]);
  });
});

describe('watchAuthenticatePanel Saga', () => {
  it('should take latest AUTHENTICATE_PANEL action and call doAuthenticatePanel', () => {
    const generator = watchAuthenticatePanel();
    const next = generator.next();

    expect(next.value).toEqual(
      takeLatest(AUTHENTICATE_PANEL, doAuthenticatePanel),
    );
  });
});

describe('doLoginApiCall Saga', () => {
  // it('should handle successful login API call', async () => {
  //   const dispatched = [];
  //   const action = {
  //     type: GET_LOGIN,
  //     param: {
  //       emailAddress: 'mehedi.hasan@questionpro.com',
  //       password: 'ab12345',
  //       accessCode: 'clean',
  //       dataCenter: 'US',
  //     },
  //   };
  //   const mockLoginResponse = {
  //     uniqueAPICallIdentifier: 0,
  //     body: {
  //       panelID: 87202,
  //       mobileAPIURL: 'https://api.questionpro.com',
  //       dataCenter: 'US',
  //       accessCode: 'code',
  //       panelDataSource: 'alt2',
  //       ID: 6775,
  //       userID: 4894850,
  //     },
  //     statusCode: 200,
  //   };
  //   const mockClfBaseUrlResponse = {
  //     data: {
  //       baseUrl: 'https://api.example.com',
  //     },
  //     statusCode: 200,
  //   };

  //   WebServiceHandler.postNew.mockResolvedValue(mockLoginResponse);
  //   WebServiceHandler.get.mockResolvedValue(mockClfBaseUrlResponse);
  //   const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');

  //   await runSaga(
  //     {
  //       dispatch: action => dispatched.push(action),
  //     },
  //     doLoginApiCall,
  //     action,
  //   ).done;

  //   expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
  //     AUTH_LOGIN,
  //     {},
  //     action.param,
  //   );

  //   expect(WebServiceHandler.get).toHaveBeenCalledWith(
  //     CLF_GET_BASE_URL,
  //     {},
  //     {dataCenter: action.param.dataCenter},
  //   );

  //   expect(dispatched).toEqual([
  //     {
  //       type: LOGIN_RESPONSE,
  //       response: mockLoginResponse,
  //       clfResponse: mockClfBaseUrlResponse,
  //     },
  //   ]);

  //   expect(setItemSpy).toHaveBeenCalledWith(
  //     ASYNC_USER_CREDENTIALS,
  //     JSON.stringify({
  //       email: action.param.emailAddress,
  //       password: action.param.password,
  //       accessCode: action.param.accessCode,
  //     }),
  //   );

  //   expect(setItemSpy).toHaveBeenCalledWith(
  //     ASYNC_CLF_BASE_URL,
  //     JSON.stringify(
  //       IS_DEV_MODE ? CLF_BASE_URL : mockClfBaseUrlResponse.data.baseUrl,
  //     ),
  //   );
  // });

  it('should handle successful login API call', async () => {
    const dispatched = [];
    const action = {
      type: GET_LOGIN,
      param: {
        emailAddress: 'test@example.com',
        password: 'password',
        accessCode: 'code',
        dataCenter: 'US',
      },
    };
    const mockLoginResponse = {
      uniqueAPICallIdentifier: 0,
      body: {
        panelID: 87202,
        mobileAPIURL: 'https://api.questionpro.com',
        dataCenter: 'US',
        accessCode: 'code',
        panelDataSource: 'alt2',
        ID: 6775,
        userID: 4894850,
      },
      statusCode: 200,
    };
    const mockClfBaseUrlResponse = {
      data: {
        baseUrl: 'https://api.example.com',
      },
      statusCode: 200,
    };

    WebServiceHandler.postNew.mockResolvedValue(mockLoginResponse);
    WebServiceHandler.get.mockResolvedValue(mockClfBaseUrlResponse);

    await runSaga(
      {
        dispatch: action_ => dispatched.push(action_),
      },
      doLoginApiCall,
      action,
    ).done;

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      AUTH_LOGIN,
      {},
      action.param,
    );

    expect(WebServiceHandler.get).toHaveBeenCalledWith(
      CLF_GET_BASE_URL,
      {},
      {dataCenter: action.param.dataCenter},
    );

    expect(dispatched).toEqual([
      {
        type: LOGIN_RESPONSE,
        response: mockLoginResponse,
        clfResponse: mockClfBaseUrlResponse,
      },
    ]);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      ASYNC_USER_CREDENTIALS,
      JSON.stringify({
        email: action.param.emailAddress,
        password: action.param.password,
        accessCode: action.param.accessCode,
      }),
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      ASYNC_CLF_BASE_URL,
      JSON.stringify(
        IS_DEV_MODE ? CLF_BASE_URL : mockClfBaseUrlResponse.data.baseUrl,
      ),
    );
  });
  it('should handle login API call error', async () => {
    const dispatched = [];
    const action = {
      type: GET_LOGIN,
      param: {
        emailAddress: 'test@example.com',
        password: 'password',
        accessCode: 'code',
        dataCenter: 'US',
      },
    };
    const error = {errorAlert: 'some error'};

    WebServiceHandler.postNew.mockRejectedValue(error);
    const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
      },
      doLoginApiCall,
      action,
    ).done;

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      AUTH_LOGIN,
      {},
      action.param,
    );

    expect(dispatched).toEqual([
      {type: API_ERROR, error: error},
      {
        type: AUTHENTICATE_PANEL_RESPONSE,
        response: {body: {mobileAPIURL: ''}},
      },
    ]);

    expect(global.baseUrl).toBe('');
    expect(global.clfBaseUrl).toBe('');
  });
});

describe('watchDoLogin Saga', () => {
  it('should take latest GET_LOGIN action and call doLoginApiCall', () => {
    const generator = watchDoLogin();
    const next = generator.next();

    expect(next.value).toEqual(takeLatest(GET_LOGIN, doLoginApiCall));
  });
});
