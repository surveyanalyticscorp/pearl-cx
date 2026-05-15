import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import NPSScoreView from './NPSScoreView';

jest.mock('../../../Utils/IconUtils', () => ({
  FaIcon: () => {
    const {View} = require('react-native');
    return <View testID="fa-icon" />;
  },
}));

const mockStore = configureStore([]);
const wrap = (npsPercentage = 67, benchmarkScore = 5) =>
  <Provider store={mockStore({dashboard: {currentNPSData: {NPSScore: {npsPercentage, benchmarkScore}}}})}>
    <NPSScoreView />
  </Provider>;

describe('NPSScoreView', () => {
  it('renders nps-score-view testID', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('nps-score-view')).toBeTruthy();
  });

  it('renders Gap: label', () => {
    const {getByText} = render(wrap());
    expect(getByText('Gap:')).toBeTruthy();
  });

  it('renders nps percentage value', () => {
    const {getByText} = render(wrap(75, 10));
    expect(getByText('75')).toBeTruthy();
  });

  it('renders gap icon', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('fa-icon')).toBeTruthy();
  });
});
