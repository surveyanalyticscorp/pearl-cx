import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import NPSScoreView from './NPSScoreView';

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

describe('NPSScoreView', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <NPSScoreView />
      </Provider>,
    );
  };

  it('should render NPSScoreView', () => {
    const {getByTestId, getAllByTestId} = renderComponent();
    expect(getByTestId('nps-score-view')).toBeTruthy();
    expect(getByTestId('nps-icon')).toBeTruthy();
    expect(getAllByTestId('text-label')).toBeTruthy();
    expect(getAllByTestId('indicator-icon')).toBeTruthy();
  });
  it('should render NPSScoreView with benchmarkScore and npsPercentage', () => {
    const {getByText} = renderComponent();

    expect(getByText('NPS:')).toBeTruthy();
    expect(getByText('67')).toBeTruthy();
    expect(getByText('62')).toBeTruthy();
  });
});
