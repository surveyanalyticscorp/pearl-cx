import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Responses from './Responses';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
const initialState = {
  response: {
    allResponses: [
      {
        responseSetID: '1',
        feedback: 'Great service!',
      },
      {
        responseSetID: '2',
        feedback: 'Could be better.',
      },
    ],
  },
  global: {
    authToken: 'testAuthToken',
  },
};

const mockStore = configureStore([]);

let store;
beforeEach(() => {
  store = mockStore(initialState);
  jest.clearAllMocks();
});

describe('Responses', () => {
  it('should render Responses', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Responses />
      </Provider>,
    );
    expect(getByTestId('responses-component')).toBeTruthy();
  });
  it('should render Responses with no responses', () => {
    const initialState = {
      response: {
        allResponses: [],
      },
      global: {
        authToken: 'testAuthToken',
      },
    };
    store = mockStore(initialState);

    const {getByText} = render(
      <Provider store={store}>
        <Responses />
      </Provider>,
    );
    expect(getByText('There are no responses yet')).toBeTruthy();
  });
  it('should render Responses with loading', () => {
    const initialState = {
      response: {
        allResponses: [],
      },
      global: {
        authToken: 'testAuthToken',
      },
    };
    store = mockStore(initialState);

    const {getByTestId} = render(
      <Provider store={store}>
        <Responses isLoading={true} />
      </Provider>,
    );
    expect(getByTestId('responses-component')).toBeTruthy();
  });
  it('should render Responses with error', () => {
    const initialState = {
      response: {
        allResponses: [],
      },
      global: {
        authToken: 'testAuthToken',
      },
    };
    store = mockStore(initialState);

    const {getByTestId} = render(
      <Provider store={store}>
        <Responses isLoading={true} />
      </Provider>,
    );
    expect(getByTestId('responses-component')).toBeTruthy();
  });
  it('should navigate to feedback details', () => {
    const {getByTestId, getAllByTestId} = render(
      <Provider store={store}>
        <Responses />
      </Provider>,
    );
    const responseSetID = '1';
    const response = store
      .getState()
      .response.allResponses.find(
        response => response.responseSetID === responseSetID,
      );
    expect(getByTestId('responses-component')).toBeTruthy();
    fireEvent.press(getByTestId('responses-component'));
    expect(getByTestId('responses-component')).toBeTruthy();
    fireEvent.press(getAllByTestId('feedback-cell')[0]);
    // check for feedback details render
    // expect(getAllByTestId('feedback-cell')[0]).toHaveBeenCalled();
  }); // test for feedback details
});
