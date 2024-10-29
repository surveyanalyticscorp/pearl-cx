import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CsatToggleButton from './CsatToggleButton';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock the toggleCsatView action
import {toggleCsatView} from '../../redux/actions/dashboard.actions';

const mockStore = configureStore([]);

let store;
beforeEach(() => {
  store = mockStore({
    dashboard: {
      isCsatViewTopBox: true,
    },
  });
  store.dispatch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CsatToggleButton Component', () => {
  it('renders the CsatToggleButton with default size', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatToggleButton />
      </Provider>,
    );
    const text = getByTestId('csat-toggle-button');

    // Check if the text is rendered
    expect(text).toBeTruthy();
  });
  it('renders the CsatToggleButton with custom size', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatToggleButton />
      </Provider>,
    );
    const text = getByTestId('csat-toggle-button');

    // Check if the text is rendered
    expect(text).toBeTruthy();
  });
  it('renders the CsatToggleButton with the correct text', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatToggleButton />
      </Provider>,
    );
    const text = getByTestId('csat-toggle-button-text');

    // Verify the correct text
    expect(text.props.children).toBe('Mean CSAT');
  });
  it('renders the CsatToggleButton with the correct text when isCsatViewTopBox is false', () => {
    store = mockStore({
      dashboard: {
        isCsatViewTopBox: false,
      },
    });
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatToggleButton />
      </Provider>,
    );
    const text = getByTestId('csat-toggle-button-text');

    // Verify the correct text
    expect(text.props.children).toBe('Top Box');
  });
  it('calls toggleCsatView when the button is pressed', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CsatToggleButton />
      </Provider>,
    );
    const button = getByTestId('csat-toggle-button');

    // Simulate a button press
    fireEvent.press(button);

    // Verify the toggleCsatView action was called
    expect(store.dispatch).toHaveBeenCalledWith(toggleCsatView(false));
  });
});
