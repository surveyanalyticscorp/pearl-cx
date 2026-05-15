import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  PathTextLabel,
  TitleAndTagsItem,
  OtherSelectedTag,
  CurrentSelectedRootCasues,
  EditCustomRootCause,
  AddCustomRootCause,
  CustomRootCauseHeader,
  CustomRootCause,
} from './CustomeRootCause';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: mockNavigate}),
}));
jest.mock('../../../widgets/TextLabel/TextLabel', () => ({text, children}) => {
  const {Text} = require('react-native');
  return <Text>{text ?? children}</Text>;
});
jest.mock('../../../widgets/SpaceBox', () => ({VerticalSpaceBox: () => null}));
jest.mock('../../../routes/commonUI/IconButton', () => ({buttonText, onPress}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID={`icon-btn-${buttonText}`}>
      <Text>{buttonText}</Text>
    </Pressable>
  );
});
jest.mock('../../../Utils/IconUtils', () => ({MaterialIcons: () => null}));
jest.mock('./TagViewItem', () => ({TagViewItem: ({item}) => {
  const {Text} = require('react-native');
  return <Text>{item.name}</Text>;
}}));
jest.mock('./utils', () => ({getSelectedTagList: () => []}));
jest.mock('../../../redux/actions/closedloop.actions', () => ({
  resetDraftTags: () => ({type: 'RESET_DRAFT_TAGS'}),
}));

const mockStore = configureStore([]);

const buildStore = (centralizeRootCause = {}) =>
  mockStore({
    dashboard: {
      ticket: {centralizeRootCause},
      centralizedRootCauseList: [],
    },
  });

describe('PathTextLabel', () => {
  it('renders its title as children', () => {
    const {getByText} = render(<PathTextLabel title="Root cause path" />);
    expect(getByText('Root cause path')).toBeTruthy();
  });
});

describe('TitleAndTagsItem', () => {
  it('renders the item title', () => {
    const item = {title: 'Category', items: []};
    const {getByText} = render(<TitleAndTagsItem item={item} index={0} />);
    expect(getByText('Category')).toBeTruthy();
  });
});

describe('OtherSelectedTag', () => {
  it('renders custom text when isOtherChecked is true', () => {
    const store = buildStore({isOtherChecked: true, otherText: 'My custom reason'});
    const {getByText} = render(
      <Provider store={store}>
        <OtherSelectedTag />
      </Provider>,
    );
    expect(getByText('Others (Custom root cause)')).toBeTruthy();
    expect(getByText('My custom reason')).toBeTruthy();
  });

  it('renders empty view when isOtherChecked is false', () => {
    const store = buildStore({isOtherChecked: false});
    const {toJSON} = render(
      <Provider store={store}>
        <OtherSelectedTag />
      </Provider>,
    );
    expect(toJSON()).toBeTruthy();
  });
});

describe('CurrentSelectedRootCasues', () => {
  it('renders without crashing', () => {
    const store = buildStore({centralizeRootCauseIds: []});
    const {toJSON} = render(
      <Provider store={store}>
        <CurrentSelectedRootCasues />
      </Provider>,
    );
    expect(toJSON()).toBeTruthy();
  });
});

describe('EditCustomRootCause', () => {
  it('calls onPress when Edit pressed', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(<EditCustomRootCause onPress={onPress} />);
    fireEvent.press(getByTestId('icon-btn-Edit'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('AddCustomRootCause', () => {
  it('renders the no root cause message', () => {
    const {getByText} = render(<AddCustomRootCause onPress={jest.fn()} />);
    expect(
      getByText(
        'Currently, this ticket does not have any custom root causes.',
      ),
    ).toBeTruthy();
  });

  it('calls onPress when Add pressed', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(<AddCustomRootCause onPress={onPress} />);
    fireEvent.press(getByTestId('icon-btn-Add'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('CustomRootCauseHeader', () => {
  it('renders the header title and children', () => {
    const {Text} = require('react-native');
    const {getByText} = render(
      <CustomRootCauseHeader>
        <Text>Child</Text>
      </CustomRootCauseHeader>,
    );
    expect(getByText('Custom root causes')).toBeTruthy();
    expect(getByText('Child')).toBeTruthy();
  });
});

describe('CustomRootCause', () => {
  it('renders Add button when no root cause exists', () => {
    const store = buildStore({centralizeRootCauseIds: [], isOtherChecked: false});
    const {getByTestId} = render(
      <Provider store={store}>
        <CustomRootCause />
      </Provider>,
    );
    expect(getByTestId('icon-btn-Add')).toBeTruthy();
  });

  it('renders Edit button when root cause IDs exist', () => {
    const store = buildStore({
      centralizeRootCauseIds: [1, 2],
      isOtherChecked: false,
    });
    const {getByTestId} = render(
      <Provider store={store}>
        <CustomRootCause />
      </Provider>,
    );
    expect(getByTestId('icon-btn-Edit')).toBeTruthy();
  });

  it('navigates to CentralizedRootCause on Edit press', () => {
    const store = buildStore({
      centralizeRootCauseIds: [1],
      isOtherChecked: false,
    });
    const {getByTestId} = render(
      <Provider store={store}>
        <CustomRootCause />
      </Provider>,
    );
    fireEvent.press(getByTestId('icon-btn-Edit'));
    expect(mockNavigate).toHaveBeenCalledWith('CentralizedRootCause');
  });

  it('dispatches resetDraftTags on mount', () => {
    const store = buildStore({});
    render(
      <Provider store={store}>
        <CustomRootCause />
      </Provider>,
    );
    expect(store.getActions()).toContainEqual({type: 'RESET_DRAFT_TAGS'});
  });
});
