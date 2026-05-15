import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import ResponseCountView from './ResponeCountView';

jest.mock('../../../widgets/dashboardWidget/LegendScoreView', () => ({
  LegendContainer: ({children}) => {
    const {View} = require('react-native');
    return <View>{children}</View>;
  },
}));

const mockStore = configureStore([]);
const wrap = (totalResponses) =>
  <Provider store={mockStore({dashboard: {currentNPSData: {NPSScore: {totalResponses}}}})}><ResponseCountView /></Provider>;

describe('ResponseCountView', () => {
  it('renders Responses label', () => {
    const {getByText} = render(wrap(100));
    expect(getByText('Responses')).toBeTruthy();
  });

  it('renders response count from store', () => {
    const {getByText} = render(wrap(42));
    expect(getByText('42')).toBeTruthy();
  });

  it('renders count element when totalResponses is undefined', () => {
    const {getByTestId} = render(wrap(undefined));
    expect(getByTestId('legend-score-count')).toBeTruthy();
  });
});
