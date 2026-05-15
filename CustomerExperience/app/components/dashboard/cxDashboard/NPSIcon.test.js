import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import NPSIcon from './NPSIcon';

jest.mock('../../../widgets/dashboardWidget/DottedLine', () => {
  const {View} = require('react-native');
  return () => <View testID="dotted-line" />;
});

const mockStore = configureStore([]);
const wrap = (npsPercentage = 50) =>
  <Provider store={mockStore({dashboard: {currentNPSData: {NPSScore: {npsPercentage}}}})}><NPSIcon /></Provider>;

describe('NPSIcon', () => {
  it('renders nps-icon testID', () => {
    const {getByTestId} = render(wrap(75));
    expect(getByTestId('nps-icon')).toBeTruthy();
  });

  it('renders dotted line', () => {
    const {getByTestId} = render(wrap(50));
    expect(getByTestId('dotted-line')).toBeTruthy();
  });
});
