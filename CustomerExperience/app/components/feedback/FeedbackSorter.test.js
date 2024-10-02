// write tests for feedback sorter
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import FeedbackSorter from './FeedbackSorter';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('FeedbackSorter', () => {
  let store;
  let props;
  beforeEach(() => {
    store = mockStore({
      global: {
        authToken: 'mock-auth-token',
      },
      response: {
        allResponses: [],
      },
      dashboard: {
        currentSegment: {currentSegmentID: 'mockSegmentId'},
      },
    });

    props = {
      route: {
        params: {
          selectedSorter: 'Date',
          setSorter: jest.fn(),
        },
      },
      navigation: {
        goBack: jest.fn(),
      },
    };
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <Provider store={store}>
        <FeedbackSorter {...props} />
      </Provider>,
    );
    expect(getByText('responses.sort_by')).toBeTruthy();
  });

  it('renders correctly with responses', () => {
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
        authToken: 'mock-auth-token',
      },
    };
    store = mockStore(initialState);

    const {getByText} = render(
      <Provider store={store}>
        <FeedbackSorter {...props} />
      </Provider>,
    );
    expect(getByText('responses.date')).toBeTruthy();
    expect(getByText('responses.score')).toBeTruthy();
    expect(getByText('dashboard.segment')).toBeTruthy();
    expect(getByText('responses.email')).toBeTruthy();
  });

  it('calls setSorter when radio button is pressed', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <FeedbackSorter {...props} />
      </Provider>,
    );

    const radioButton = getByTestId('radio-buttonInputradio-button|0');
    fireEvent.press(radioButton);
    expect(props.route.params.setSorter).toHaveBeenCalled();
  });
  it('Navigate back when radio button is pressed', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <FeedbackSorter {...props} />
      </Provider>,
    );

    const radioButton = getByTestId('radio-buttonInputradio-button|0');
    fireEvent.press(radioButton);
    expect(props.navigation.goBack).toHaveBeenCalled();
  });
});
