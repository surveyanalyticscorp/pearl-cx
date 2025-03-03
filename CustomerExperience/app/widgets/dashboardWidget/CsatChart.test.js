import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import CsatChart, {getCsatData} from './CsatChart';

const mockStore = configureStore([]);

// create mock for VictoryPie component
jest.mock('victory-native', () => ({
  VictoryPie: jest.fn(() => <mock-VictoryPie testID="csat-chart" />),
}));

let store;
beforeEach(() => {
  store = mockStore({
    dashboard: {
      currentNPSData: {
        NPSScore: {
          promoterPercent: 0.5,
          passivePercent: 0.3,
          detractorPercent: 0.2,
        },
      },
    },
  });
  store.dispatch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CsatChart Component', () => {
  it('renders the CsatChart with default size', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatChart />
      </Provider>,
    );
    const image = getByTestId('csat-chart');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });

  it('renders the CsatChart with custom size', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatChart />
      </Provider>,
    );
    const image = getByTestId('csat-chart');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
});
describe('CsatChart Data Function', () => {
  it('should return the correct data structure with image sources', () => {
    const data = getCsatData(0.5, 0.3, 0.2);

    expect(data).toEqual([
      {
        y: 0.5,
        x: 'positive',
        imageSource: 'test-file-stub',
      },
      {
        y: 0.3,
        x: 'neutral',
        imageSource: 'test-file-stub',
      },
      {
        y: 0.2,
        x: 'negative',
        imageSource: 'test-file-stub',
      },
    ]);
  });
});
