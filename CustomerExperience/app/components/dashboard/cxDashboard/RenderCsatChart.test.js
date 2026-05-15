import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import RenderCSATChart from './RenderCsatChart';

jest.mock('../../../widgets/dashboardWidget/CsatChart', () => {
  const {View} = require('react-native');
  return () => <View testID="csat-chart" />;
});
jest.mock('../../../widgets/dashboardWidget/CsatScoreLabel', () => {
  const {View} = require('react-native');
  return () => <View testID="csat-score-label" />;
});
jest.mock('../../../widgets/dashboardWidget/CsatToggleButton', () => {
  const {View} = require('react-native');
  return () => <View testID="csat-toggle-button" />;
});
jest.mock('./ChartLegendView', () => {
  const {View} = require('react-native');
  return () => <View testID="chart-legend-view" />;
});

const mockStore = configureStore([]);

const buildStore = (NPSScore = null) =>
  mockStore({dashboard: {currentNPSData: {NPSScore}}});

describe('RenderCSATChart', () => {
  it('renders empty view when NPSScore is null', () => {
    const {queryByTestId} = render(
      <Provider store={buildStore(null)}>
        <RenderCSATChart />
      </Provider>,
    );
    expect(queryByTestId('csat-chart')).toBeNull();
  });

  it('renders chart components when NPSScore exists', () => {
    const {getByTestId} = render(
      <Provider store={buildStore({npsPercentage: 70})}>
        <RenderCSATChart />
      </Provider>,
    );
    expect(getByTestId('csat-chart')).toBeTruthy();
    expect(getByTestId('csat-score-label')).toBeTruthy();
    expect(getByTestId('csat-toggle-button')).toBeTruthy();
    expect(getByTestId('chart-legend-view')).toBeTruthy();
  });

  it('renders empty view when NPSScore is undefined', () => {
    const {queryByTestId} = render(
      <Provider store={buildStore(undefined)}>
        <RenderCSATChart />
      </Provider>,
    );
    expect(queryByTestId('csat-chart')).toBeNull();
  });
});
