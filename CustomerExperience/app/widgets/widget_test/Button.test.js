import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import QPButton from '../Button';
import '../../../setupTests';

it('should render correctly <QPButton> component', () => {
  const mockStore = configureStore();
  const store = mockStore({});
  const wrapper = mount(
    <Provider store={store}>
      <QPButton />
    </Provider>,
  );

  expect(wrapper).toMatchSnapshot();
});
