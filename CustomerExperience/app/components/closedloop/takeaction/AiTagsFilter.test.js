import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import AiTagsFilter from './AiTagsFilter';

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({goBack: mockGoBack, canGoBack: mockCanGoBack}),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({children}) => {
    const {View} = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('../../../routes/commonUI/BottomSheetHeader', () => ({
  PanelHandler: () => null,
}));

jest.mock('../../../routes/commonUI/CommonUI', () => ({
  ChipItem: ({title, onPress}) => {
    const {Pressable, Text} = require('react-native');
    return (
      <Pressable onPress={() => onPress({name: title, isChecked: false})} testID={`chip-${title}`}>
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));

jest.mock('../../../widgets/Button', () => ({onPress, buttonText}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID="done-button">
      <Text>{buttonText}</Text>
    </Pressable>
  );
});

const mockStore = configureStore([]);
const makeStore = (tags = []) =>
  mockStore({
    dashboard: {ticketTags: tags},
    global: {userInfo: {feedbackID: 'fb1'}},
  });

const wrap = (tags) => (
  <Provider store={makeStore(tags)}>
    <AiTagsFilter />
  </Provider>
);

describe('AiTagsFilter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders AI tags header', () => {
    const {getByText} = render(wrap([]));
    expect(getByText('AI tags')).toBeTruthy();
  });

  it('renders search input', () => {
    const {getByPlaceholderText} = render(wrap([]));
    expect(getByPlaceholderText('Search tags')).toBeTruthy();
  });

  it('renders tag chips from store', () => {
    const tags = [{id: 1, name: 'urgent', isChecked: false}];
    const {getByText} = render(wrap(tags));
    expect(getByText('urgent')).toBeTruthy();
  });

  it('filters tags based on search input', () => {
    const tags = [
      {id: 1, name: 'urgent', isChecked: false},
      {id: 2, name: 'billing', isChecked: false},
    ];
    const {getByPlaceholderText, queryByText} = render(wrap(tags));
    fireEvent.changeText(getByPlaceholderText('Search tags'), 'urg');
    expect(queryByText('billing')).toBeNull();
  });

  it('calls goBack on done press when canGoBack', () => {
    const {getByTestId} = render(wrap([]));
    fireEvent.press(getByTestId('done-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
