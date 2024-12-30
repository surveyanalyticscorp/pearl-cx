import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import ChartLegendView from './ChartLegendView';
const mockStore = configureStore([]);
const initialState = {
  dashboard: {
    currentNPSData: {
      NPSScore: {
        benchmarkScore: 5,
        npsPercentage: 67,
      },
    },
    dashboardData: {
      scoringModel: 1,
    },
  },
  global: {
    authToken: 'mock-token',
  },
};

describe('ChartLegendView', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });

  const renderComponent = (store_ = mockStore(initialState)) => {
    return render(
      <Provider store={store_ ?? store}>
        <ChartLegendView />
      </Provider>,
    );
  };

  it('should render ChartLegendView with csat data', () => {
    const {getByText} = renderComponent();
    expect(getByText('Negatives')).toBeTruthy();
    expect(getByText('Neutral')).toBeTruthy();
    expect(getByText('Positives')).toBeTruthy();
  });

  it('should render ChartLegendView with nps data', () => {
    const {getByText} = renderComponent(
      mockStore({
        ...initialState,
        dashboard: {
          ...initialState.dashboard,
          dashboardData: {scoringModel: 0},
        },
      }),
    );
    expect(getByText('Detractors')).toBeTruthy();
    expect(getByText('Passive')).toBeTruthy();
    expect(getByText('Promoters')).toBeTruthy();
  });
});
