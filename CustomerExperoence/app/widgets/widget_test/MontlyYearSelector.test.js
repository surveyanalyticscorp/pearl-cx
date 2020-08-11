import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import MonthYearSelector from '../MonthYearSelector';
import '../../../setupTests';

it('should render correctly <MonthYearSelector> component', () => {
  const mockStore = configureStore();
  const store = mockStore({});
  const wrapper = mount(
    <Provider store={store}>
      <MonthYearSelector />
    </Provider>,
  );

  expect(wrapper).toMatchSnapshot();
});
