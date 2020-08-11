import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import QPWebView from '../QPWebView';
import '../../../setupTests';

it('should render correctly <QPWebView> component', () => {
  const mockStore = configureStore();
  const store = mockStore({});
  const wrapper = mount(
    <Provider store={store}>
      <QPWebView />
    </Provider>,
  );

  expect(wrapper).toMatchSnapshot();
});
