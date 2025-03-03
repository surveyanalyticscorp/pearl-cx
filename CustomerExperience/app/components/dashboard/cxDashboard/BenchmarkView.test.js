import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import BenchmarkView from './BenchmarkView';
const mockStore = configureStore([]);
const initialState = {
  dashboard: {
    currentNPSData: {
      NPSScore: {
        benchmarkScore: 5,
        npsPercentage: 67,
      },
    },
  },
};

describe('BenchmarkView', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('should render BenchmarkView', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <BenchmarkView />
      </Provider>,
    );
    expect(getByTestId('benchmark-view')).toBeTruthy();
    expect(getByTestId('text-label')).toBeTruthy();
    expect(getByTestId('dotted-line')).toBeTruthy();
  });
});
