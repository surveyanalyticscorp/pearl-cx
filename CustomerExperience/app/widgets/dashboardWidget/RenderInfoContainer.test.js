import React from 'react';
import {render} from '@testing-library/react-native';
import RenderInfoContainer from './RenderInfoContainer';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

let store;
beforeEach(() => {
  store = mockStore({
    dashboard: {
      currentNPSData: {
        NPSScore: {
          totalResponses: 100,
        },
      },
    },
  });
});
afterEach(() => {
  jest.clearAllMocks();
});
describe('RenderInfoContainer Component', () => {
  it('renders the RenderInfoContainer with default size', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <RenderInfoContainer />
      </Provider>,
    );
    const image = getByTestId('render-info-container');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
});
