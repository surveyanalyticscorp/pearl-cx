import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import BenchmarkView from './BenchmarkView';

jest.mock('../../../../assets/images/goal_icon.svg', () => {
  const {View} = require('react-native');
  return () => <View testID="goal-icon" />;
});

jest.mock('../../../widgets/dashboardWidget/DottedLine', () => {
  const {View} = require('react-native');
  return () => <View testID="dotted-line" />;
});

const mockStore = configureStore([]);
const wrap = (benchmarkScore = 5) =>
  <Provider store={mockStore({dashboard: {currentNPSData: {NPSScore: {benchmarkScore, npsPercentage: 67}}}})}>
    <BenchmarkView />
  </Provider>;

describe('BenchmarkView', () => {
  it('renders benchmark-view testID', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('benchmark-view')).toBeTruthy();
  });

  it('renders Goal label with benchmark score', () => {
    const {getByText} = render(wrap(10));
    expect(getByText('Goal: 10')).toBeTruthy();
  });

  it('renders goal icon', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('goal-icon')).toBeTruthy();
  });

  it('renders Goal label with score 0', () => {
    const {getByText} = render(wrap(0));
    expect(getByText('Goal: 0')).toBeTruthy();
  });

  it('renders Goal label with negative score', () => {
    const {getByText} = render(wrap(-20));
    expect(getByText('Goal: -20')).toBeTruthy();
  });
});
