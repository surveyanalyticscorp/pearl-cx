import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import QPTextField from '../../widgets/TextField';
import '../../../setupTests';

it('should render correctly <QPTextField> component', () => {
  const mockStore = configureStore();
  const store = mockStore({});
  const wrapper = mount(
    <Provider store={store}>
      <QPTextField />
    </Provider>,
  );

  expect(wrapper).toMatchSnapshot();
});
