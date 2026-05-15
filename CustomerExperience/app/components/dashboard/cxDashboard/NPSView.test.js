import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import NPSView from './NPSView';

jest.mock('../../../widgets/dashboardWidget/NpsGaugeChart', () => {
  const {View} = require('react-native');
  return () => <View testID="nps-gauge-chart" />;
});

jest.mock('./BenchmarkView', () => {
  const {View} = require('react-native');
  return () => <View testID="benchmark-view" />;
});

jest.mock('./ChartLegendView', () => {
  const {View} = require('react-native');
  return () => <View testID="chart-legend-view" />;
});

jest.mock('./NPSScoreView', () => {
  const {View} = require('react-native');
  return () => <View testID="nps-score-view" />;
});

const mockStore = configureStore([]);
const wrap = (npsPercentage = 50) =>
  <Provider store={mockStore({dashboard: {currentNPSData: {NPSScore: {npsPercentage}}}})}>
    <NPSView />
  </Provider>;

describe('NPSView', () => {
  it('renders gauge chart', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('nps-gauge-chart')).toBeTruthy();
  });

  it('renders NPS text', () => {
    const {getByText} = render(wrap(75));
    expect(getByText('NPS')).toBeTruthy();
  });

  it('renders all sub-components', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('benchmark-view')).toBeTruthy();
    expect(getByTestId('chart-legend-view')).toBeTruthy();
    expect(getByTestId('nps-score-view')).toBeTruthy();
  });
});
