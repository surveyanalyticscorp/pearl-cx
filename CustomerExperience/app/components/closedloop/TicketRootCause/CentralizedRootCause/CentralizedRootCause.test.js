import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {CentralizedRootCause, OtherTag} from './CentralizedRootCause';

const mockNavigate = jest.fn();
const mockCanGoBack = jest.fn(() => true);
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: mockNavigate, canGoBack: mockCanGoBack}),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({children}) => children,
}));
jest.mock('../../CentralizedRootCause/components/CollapsableView', () => ({
  children,
  headerTitle,
}) => {
  const {View, Text} = require('react-native');
  return (
    <View>
      <Text>{headerTitle}</Text>
      {children}
    </View>
  );
});
jest.mock('../../../../routes/commonUI/CommonUI', () => ({
  CheckBox: ({isChecked}) => {
    const {View} = require('react-native');
    return <View testID={`checkbox-${isChecked}`} />;
  },
  CheckBoxItem: ({title, onPress, isChecked}) => {
    const {Pressable, Text} = require('react-native');
    return (
      <Pressable onPress={() => onPress && onPress({}, 0)} testID={`checkboxitem-${title}`}>
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));
jest.mock('../../../../widgets/Button', () => ({
  buttonText,
  onPress,
  testID,
  isDisabled,
}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID={testID ?? `qpbutton-${buttonText}`} disabled={isDisabled}>
      <Text>{buttonText}</Text>
    </Pressable>
  );
});
jest.mock('../../../../widgets/SpaceBox', () => ({VerticalSpaceBox: () => null}));
jest.mock('../utils', () => ({
  isTagChecked: () => false,
  getTagCountFromSelectedList: () => 0,
}));
jest.mock('../../../../redux/actions/closedloop.actions', () => ({
  addDraftTags: (tags, isOther, text) => ({type: 'ADD_DRAFT_TAGS', tags, isOther, text}),
  removeDraftTags: tags => ({type: 'REMOVE_DRAFT_TAGS', tags}),
  resetCentralizedRootCause: () => ({type: 'RESET_CENTRALIZED_ROOT_CAUSE'}),
  updateCentralizedRootCause: (id, selected, apiKey) => ({
    type: 'UPDATE_CENTRALIZED_ROOT_CAUSE',
    id,
    selected,
    apiKey,
  }),
}));
jest.mock('../../../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
  showSuccessFlashMessage: jest.fn(),
}));

const mockStore = configureStore([]);

const buildStore = (overrides = {}) =>
  mockStore({
    dashboard: {
      centralizedRootCauseList: [],
      ticket: {id: 1, centralizeRootCause: null},
      selectedRootCauses: {
        centralizeRootCauseIds: [],
        isOtherChecked: false,
        otherText: '',
        hasUpdated: false,
      },
      centralizedRootCauseUpdateStatus: null,
      ...overrides,
    },
    global: {userInfo: {feedbackApiKey: 'key123'}},
  });

describe('CentralizedRootCause', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing with empty list', () => {
    const store = buildStore();
    const {toJSON} = render(
      <Provider store={store}>
        <CentralizedRootCause />
      </Provider>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders root cause items from Redux state', () => {
    const store = buildStore({
      centralizedRootCauseList: [
        {id: 1, name: 'Product Quality', rcTags: []},
        {id: 2, name: 'Delivery', rcTags: []},
      ],
    });
    const {getByText} = render(
      <Provider store={store}>
        <CentralizedRootCause />
      </Provider>,
    );
    expect(getByText('Product Quality (0)')).toBeTruthy();
    expect(getByText('Delivery (0)')).toBeTruthy();
  });

  it('renders the Update button', () => {
    const store = buildStore();
    const {getByTestId} = render(
      <Provider store={store}>
        <CentralizedRootCause />
      </Provider>,
    );
    expect(getByTestId('ApplyButton')).toBeTruthy();
  });

  it('dispatches updateCentralizedRootCause when Update pressed with hasUpdated=true', () => {
    const store = buildStore({
      selectedRootCauses: {
        centralizeRootCauseIds: [1],
        isOtherChecked: false,
        otherText: '',
        hasUpdated: true,
      },
    });
    const {getByTestId} = render(
      <Provider store={store}>
        <CentralizedRootCause />
      </Provider>,
    );
    fireEvent.press(getByTestId('ApplyButton'));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({type: 'UPDATE_CENTRALIZED_ROOT_CAUSE'}),
    );
  });

  it('shows error when isOtherChecked=true but otherText is empty', () => {
    const {showErrorFlashMessage} = require('../../../../Utils/Utility');
    const store = buildStore({
      selectedRootCauses: {
        centralizeRootCauseIds: [],
        isOtherChecked: true,
        otherText: '',
        hasUpdated: true,
      },
    });
    const {getByTestId} = render(
      <Provider store={store}>
        <CentralizedRootCause />
      </Provider>,
    );
    fireEvent.press(getByTestId('ApplyButton'));
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Please enter the other text');
  });
});

describe('OtherTag', () => {
  it('renders TextInput when no preDefinedOtherText', () => {
    const store = buildStore({
      ticket: {id: 1, centralizeRootCause: null},
      selectedRootCauses: {
        centralizeRootCauseIds: [],
        isOtherChecked: false,
        otherText: '',
        hasUpdated: false,
      },
    });
    const {toJSON} = render(
      <Provider store={store}>
        <OtherTag />
      </Provider>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders CheckBoxItem when preDefinedOtherText exists', () => {
    const store = buildStore({
      ticket: {id: 1, centralizeRootCause: {otherText: 'Existing reason'}},
      selectedRootCauses: {
        centralizeRootCauseIds: [],
        isOtherChecked: true,
        otherText: 'Existing reason',
        hasUpdated: false,
      },
    });
    const {getByTestId} = render(
      <Provider store={store}>
        <OtherTag />
      </Provider>,
    );
    expect(getByTestId('checkboxitem-Existing reason')).toBeTruthy();
  });

  it('dispatches addDraftTags when TextInput changes', () => {
    const store = buildStore();
    const {UNSAFE_getByType} = render(
      <Provider store={store}>
        <OtherTag />
      </Provider>,
    );
    const {TextInput} = require('react-native');
    fireEvent.changeText(UNSAFE_getByType(TextInput), 'new text');
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({type: 'ADD_DRAFT_TAGS'}),
    );
  });
});
