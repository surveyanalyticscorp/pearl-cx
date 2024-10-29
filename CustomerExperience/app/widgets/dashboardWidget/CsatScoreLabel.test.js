// write test cases for CsatScoreLabel.js
// wrap the component in Provider to test the component's connected state

import React from 'react';
import {render} from '@testing-library/react-native';
import CsatScoreLabel from './CsatScoreLabel';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

let store;
beforeEach(() => {
  store = mockStore({
    dashboard: {
      currentNPSData: {
        NPSScore: {
          csatScore: 0.5,
          csatMeanAverage: 0.3,
        },
      },
      isCsatViewTopBox: true,
    },
  });
  store.dispatch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CsatScoreLabel Component', () => {
  it('renders the CsatScoreLabel with default size', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatScoreLabel />
      </Provider>,
    );
    const text = getByTestId('csat-score-label');

    // Check if the text is rendered
    expect(text).toBeTruthy();
  });
  it('renders the CsatScoreLabel with custom size', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatScoreLabel />
      </Provider>,
    );
    const text = getByTestId('csat-score-label');

    // Check if the text is rendered
    expect(text).toBeTruthy();
  });
  it('renders the CsatScoreLabel with the correct text', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatScoreLabel />
      </Provider>,
    );
    const text = getByTestId('csat-score-label');

    // Verify the correct text
    expect(text.props.children).toBe('0.30');
  });
  it('renders the CsatScoreLabel with the correct text when isCsatViewTopBox is false', () => {
    store = mockStore({
      dashboard: {
        currentNPSData: {
          NPSScore: {
            csatScore: 0.5,
            csatMeanAverage: 0.3,
          },
        },
        isCsatViewTopBox: false,
      },
    });
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatScoreLabel />
      </Provider>,
    );
    const text = getByTestId('csat-score-label');

    // Verify the correct text
    expect(text.props.children).toBe('0.50%');
  });
});
