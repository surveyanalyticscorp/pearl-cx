import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TemplateIcon from './TemplateIcon';

jest.mock('../../../Utils/IconUtils', () => ({IonIcon: () => null}));

const mockStore = configureStore([]);

describe('TemplateIcon', () => {
  it('renders without crashing', () => {
    const store = mockStore({});
    const {toJSON} = render(
      <Provider store={store}>
        <TemplateIcon onPressTemplate={jest.fn()} />
      </Provider>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('calls onPressTemplate when pressed', () => {
    const store = mockStore({});
    const onPress = jest.fn();
    const {UNSAFE_getByType} = render(
      <Provider store={store}>
        <TemplateIcon onPressTemplate={onPress} />
      </Provider>,
    );
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(onPress).toHaveBeenCalled();
  });
});
