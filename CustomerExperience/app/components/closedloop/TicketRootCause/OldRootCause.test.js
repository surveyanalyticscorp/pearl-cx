import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {OldRootCause, hasId} from './OldRootCause';

jest.mock('../../../Utils/MultilinguaUtils', () => ({
  translate: key => key,
}));

jest.mock('../../../Utils/StringUtils', () => ({
  __esModule: true,
  default: {
    uppercaseFirstCharRestLowercase: jest.fn(s => s),
  },
}));

jest.mock('../RenderRootCauseItem', () => {
  const React = require('react');
  const {View, Text, Pressable} = require('react-native');
  return ({title, data, onClickCheckBox}) => (
    <View testID={`root-cause-item-${title}`}>
      <Text>{title}</Text>
      {(data || []).map((item, index) => (
        <Pressable
          key={item.id}
          testID={`checkbox-${item.id}`}
          onPress={() => onClickCheckBox(title, item, index)}>
          <Text>{item.name || item.actionName}</Text>
        </Pressable>
      ))}
    </View>
  );
});

jest.mock('../RenderSegmentItem', () => {
  const React = require('react');
  const {View} = require('react-native');
  return () => <View testID="segment-item" />;
});

const mockStore = configureStore([]);

const makeStore = (overrides = {}) =>
  mockStore({
    global: {authToken: 'tok', userInfo: {feedbackApiKey: 'fkey'}},
    dashboard: {
      ticket: {
        id: 42,
        rootCauses: [{id: 1}],
        rootCauseActions: [{id: 1}],
        currentSegment: {id: 'seg1'},
        originSegment: {id: 'seg2'},
      },
      rootCauseList: [
        {id: 1, name: 'Price'},
        {id: 2, name: 'Quality'},
      ],
      rootCauseActionList: [{id: 1, actionName: 'Refund'}],
      ...overrides,
    },
  });

const wrap = (store = makeStore()) => (
  <Provider store={store}>
    <OldRootCause />
  </Provider>
);

describe('hasId utility', () => {
  it('returns true when id is found in array', () => {
    expect(hasId(1, [{id: 1}, {id: 2}])).toBe(true);
  });

  it('returns false when id is not in array', () => {
    expect(hasId(99, [{id: 1}, {id: 2}])).toBe(false);
  });

  it('returns false for empty array default', () => {
    expect(hasId(1)).toBe(false);
  });
});

describe('OldRootCause component', () => {
  it('renders root-cause-view', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('root-cause-view')).toBeTruthy();
  });

  it('renders root cause list from Redux', () => {
    const {getByText} = render(wrap());
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('Quality')).toBeTruthy();
  });

  it('renders root action list from Redux', () => {
    const {getByText} = render(wrap());
    expect(getByText('Refund')).toBeTruthy();
  });

  it('renders reset and update buttons', () => {
    const {getByTestId} = render(wrap());
    expect(getByTestId('RootCasueResetButton')).toBeTruthy();
    expect(getByTestId('RootCauseUpdateButton')).toBeTruthy();
  });

  it('dispatches updateRootCause action when update button pressed', () => {
    const store = makeStore();
    const {getByTestId} = render(wrap(store));
    fireEvent.press(getByTestId('RootCauseUpdateButton'));
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe('UPDATE_ROOT_CAUSE');
    expect(actions[0].param.rootCauses).toBeDefined();
    expect(actions[0].param.rootCauseActions).toBeDefined();
  });

  it('includes only checked root causes in dispatch payload', () => {
    const store = makeStore();
    const {getByTestId} = render(wrap(store));
    fireEvent.press(getByTestId('RootCauseUpdateButton'));
    const action = store.getActions()[0];
    expect(action.param.rootCauses).toContain(1);
    expect(action.param.rootCauses).not.toContain(2);
  });

  it('renders without crash when rootCauseList is empty', () => {
    const store = makeStore({rootCauseList: []});
    const {getByTestId} = render(wrap(store));
    expect(getByTestId('root-cause-view')).toBeTruthy();
  });

  it('renders without crash when rootCauseActionList is empty', () => {
    const store = makeStore({rootCauseActionList: []});
    const {getByTestId} = render(wrap(store));
    expect(getByTestId('root-cause-view')).toBeTruthy();
  });

  it('reset button press does not crash', () => {
    const store = makeStore();
    const {getByTestId} = render(wrap(store));
    expect(() => fireEvent.press(getByTestId('RootCasueResetButton'))).not.toThrow();
  });
});
