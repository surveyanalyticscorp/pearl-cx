import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import TimeAgo from '../TimeAgo';
import '../../../setupTests';

it('should render correctly <TimeAgo> component', () => {
  const mockStore = configureStore();
  const store = mockStore({});
  const wrapper = mount(
    <Provider store={store}>
      <TimeAgo />
    </Provider>,
  );

  expect(wrapper).toMatchSnapshot();
});
