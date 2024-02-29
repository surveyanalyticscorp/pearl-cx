// import {put, takeLatest} from 'redux-saga/effects';
// import {doLoginApiCall, watchDoLogin} from '../redux/sagas/loginInSaga';
// import {GET_LOGIN, LOGIN_RESPONSE} from '../redux/actions';

// describe('SAGAS', () => {
//   it('should dispatch action "GET_LOGIN" ', () => {
//     const generator = watchDoLogin();

//     expect(generator.next().value).toEqual(
//         takeLatest(GET_LOGIN, doLoginApiCall),
//     );
//     expect(generator.next().done).toBeTruthy();
//   });

//   it('should dispatch action "LOGIN_RESPONSE" with result from fetch News API', () => {
//     const mockResponse = {
//       authToken:
//           'eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIiwidWlkIjoxNzMyOSwicGlkIjoxMDI2NiwiZXhwIjoxNTk3NDAxMzE3LCJpYXQiOjE1OTY3OTY1MTcsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIn0.jZq2KozQ7bdZhAXOZ07ti0Sp3mz-fFUf22oVPZiNVYI',
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
//         put({type: LOGIN_RESPONSE, response: mockResponse}),
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
//       errorAlert: "Invalid company code.",
//       statusCode: 400,
//       uniqueAPICallIdentifier: 0,
//       validationErrors: []
//     };

//     const generator = doLoginApiCall(action);
//     generator.next();
//     expect(generator.next(mockResponse).value).toEqual(put({type: LOGIN_RESPONSE, response: mockResponse}));
//     expect(generator.next).toThrow(Error);
//   });

// });
