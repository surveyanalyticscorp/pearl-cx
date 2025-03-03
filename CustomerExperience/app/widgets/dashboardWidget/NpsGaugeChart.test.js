import React from 'react';
import {render} from '@testing-library/react-native';
import NpsGaugeChart, {populateHandspulateHands} from './NpsGaugeChart';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

let store;
beforeEach(() => {
  store = mockStore({
    dashboard: {
      currentNPSData: {
        NPSScore: {
          totalResponses: 100,
          promoterPercent: 0.5,
          passivePercent: 0.3,
          detractorPercent: 0.2,
          npsPercentage: 0.5,
          benchmarkScore: 0.3,
        },
      },
    },
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <NpsGaugeChart />
    </Provider>,
  );
};

describe('NpsGaugeChart Component', () => {
  it('renders the NpsGaugeChart with default size', () => {
    const {getByTestId} = renderComponent();
    const amChart = getByTestId('chart-container');

    // Check if the image is rendered
    expect(amChart).toBeTruthy();
  });
});
