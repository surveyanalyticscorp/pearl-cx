// write test for index reducer
import indexReducer from './index.reducer';
import {CLEAR_USER_INFO} from '../actions';

// Mock the individual reducers
jest.mock('./DashboardReducer', () => jest.fn((state = {}, action) => state));
jest.mock('./GlobalReducer', () => jest.fn((state = {}, action) => state));
jest.mock('./NotificationReducer', () =>
  jest.fn((state = {}, action) => state),
);
jest.mock('./FeedbackReducer', () => jest.fn((state = {}, action) => state));

// Mock NetworkReducer
jest.mock('react-native-redux-connectivity', () => ({
  NetworkReducer: jest.fn(
    (state = {isConnected: true, type: 'wifi'}, action) => state,
  ),
}));

describe('index reducer', () => {
  it('should return the initial state', () => {
    expect(indexReducer(undefined, {})).toEqual({
      network: {
        isConnected: true,
        type: 'wifi',
      },
      dashboard: {},
      global: {},
      login: {
        accessCode: '',
        email: '',
        password: '',
      },
      notification: {},
      response: {},
    });
  });

  it('should handle CLEAR_USER_INFO', () => {
    expect(
      indexReducer(
        {
          network: {
            isConnected: true,
            type: 'wifi',
          },
          dashboard: {},
          global: {},
          login: {
            accessCode: '',
            email: '',
            password: '',
          },
          notification: {},
          response: {},
        },
        {
          type: CLEAR_USER_INFO,
        },
      ),
    ).toEqual({
      network: {
        isConnected: true,
        type: 'wifi',
      },
      dashboard: {},
      global: {},
      login: {
        accessCode: '',
        email: '',
        password: '',
      },
      notification: {},
      response: {},
    });
  });
});
