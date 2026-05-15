import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import ActionHistory from './ActionHistory';

const mockStore = configureStore([]);

const makeStore = (summary = null) =>
  mockStore({dashboard: {ticketActionHistory: {summary}}});

const wrap = (ui, summary) => (
  <Provider store={makeStore(summary)}>{ui}</Provider>
);

describe('ActionHistory', () => {
  it('renders children when summary has action data', () => {
    const summary = {data: {action: {subject: 'Hi'}}};
    const {getByText} = render(
      wrap(
        <ActionHistory>
          <>{require('react-native').Text && null}</>
          {/* text child */}
          {require('react').createElement(
            require('react-native').Text,
            {testID: 'child-text'},
            'Child',
          )}
        </ActionHistory>,
        summary,
      ),
    );
    expect(getByText('Action history')).toBeTruthy();
    expect(getByText('Child')).toBeTruthy();
  });

  it('renders empty view when summary has no action data', () => {
    const summary = {data: {action: null}};
    const {queryByText} = render(
      wrap(<ActionHistory><></></ActionHistory>, summary),
    );
    expect(queryByText('Action history')).toBeNull();
  });

  it('renders empty view when summary.data.action is explicitly null', () => {
    const summary = {data: {action: null}};
    const {queryByText} = render(
      wrap(<ActionHistory><></></ActionHistory>, summary),
    );
    expect(queryByText('Action history')).toBeNull();
  });
});
