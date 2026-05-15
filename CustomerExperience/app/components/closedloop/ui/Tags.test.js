import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {Tag} from './Tags';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({goBack: mockGoBack, canGoBack: mockCanGoBack}),
}));

const mockStore = configureStore([]);
const wrap = ui => <Provider store={mockStore({})}>{ui}</Provider>;

describe('Tag', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders null when tags is empty', () => {
    const {toJSON} = render(wrap(<Tag tags={[]} />));
    expect(toJSON()).toBeNull();
  });

  it('renders null when tags is undefined', () => {
    const {toJSON} = render(wrap(<Tag />));
    expect(toJSON()).toBeNull();
  });

  it('renders tag names', () => {
    const tags = [{id: 1, name: 'urgent', isChecked: false}];
    const {getByText} = render(wrap(<Tag tags={tags} />));
    expect(getByText('urgent')).toBeTruthy();
  });

  it('dispatches updateSingleTag on tag press', () => {
    const tags = [{id: 1, name: 'urgent', isChecked: false}];
    const {getByText} = render(wrap(<Tag tags={tags} />));
    fireEvent.press(getByText('urgent'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('calls goBack after tag press if canGoBack', () => {
    const tags = [{id: 1, name: 'urgent', isChecked: false}];
    const {getByText} = render(wrap(<Tag tags={tags} />));
    fireEvent.press(getByText('urgent'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
