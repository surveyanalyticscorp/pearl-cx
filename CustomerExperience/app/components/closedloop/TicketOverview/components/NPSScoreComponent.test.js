import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import NPSScoreComponent from './NPSScoreComponent';

jest.mock('../../../../widgets/TextLabel/TextLabel', () => ({text}) => {
  const {Text} = require('react-native');
  return <Text>{text}</Text>;
});
jest.mock('../../../view/NPSScoreView', () => ({text}) => {
  const {Text} = require('react-native');
  return <Text testID="nps-score-view">{text}</Text>;
});
jest.mock('../../../../Utils/StringUtils', () => ({
  __esModule: true,
  default: {
    isEmptyOrNull: val => val === null || val === undefined || val === '',
  },
}));

const mockStore = configureStore([]);
const buildStore = (npsScore) =>
  mockStore({dashboard: {ticket: {npsScore}}});

describe('NPSScoreComponent', () => {
  it('renders NPS score when npsScore is present', () => {
    const {getByText, getByTestId} = render(
      <Provider store={buildStore(7)}>
        <NPSScoreComponent />
      </Provider>,
    );
    expect(getByText('NPS:')).toBeTruthy();
    expect(getByTestId('nps-score-view')).toBeTruthy();
  });

  it('renders empty view when npsScore is null', () => {
    const {queryByTestId} = render(
      <Provider store={buildStore(null)}>
        <NPSScoreComponent />
      </Provider>,
    );
    expect(queryByTestId('nps-score-view')).toBeNull();
  });

  it('renders empty view when npsScore is 0 (empty string check)', () => {
    const {queryByTestId} = render(
      <Provider store={buildStore(undefined)}>
        <NPSScoreComponent />
      </Provider>,
    );
    expect(queryByTestId('nps-score-view')).toBeNull();
  });
});
