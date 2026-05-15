import React from 'react';
import {render} from '@testing-library/react-native';
import CustomKeyboardToolbar from './CustomKeyboardToolbar';

const mockIconMap = {};
jest.mock('react-native-pell-rich-editor', () => ({
  RichToolbar: ({iconMap}) => {
    const {View} = require('react-native');
    Object.assign(mockIconMap, iconMap || {});
    return <View testID="rich-toolbar" />;
  },
  actions: {
    setBold: 'bold',
    setItalic: 'italic',
    setUnderline: 'underline',
    alignLeft: 'alignLeft',
    alignCenter: 'alignCenter',
    alignRight: 'alignRight',
    alignFull: 'alignFull',
  },
}));

jest.mock('../../../Utils/IconUtils', () => ({
  MaterialIcons: () => null,
  MaterialCommunityIcons: () => null,
}));

describe('CustomKeyboardToolbar', () => {
  it('renders toolbar container', () => {
    const {getByTestId} = render(
      <CustomKeyboardToolbar
        toolbarRef={null}
        richTextfieldRef={null}
        keyboardHeight={0}
        handleCustomInsertLink={jest.fn()}
      />,
    );
    expect(getByTestId('rich-toolbar')).toBeTruthy();
  });

  it('renders with non-zero keyboardHeight', () => {
    const {getByTestId} = render(
      <CustomKeyboardToolbar
        toolbarRef={null}
        richTextfieldRef={null}
        keyboardHeight={300}
        handleCustomInsertLink={jest.fn()}
      />,
    );
    expect(getByTestId('rich-toolbar')).toBeTruthy();
  });

  it('renders iconMap icon components without crashing', () => {
    render(
      <CustomKeyboardToolbar
        toolbarRef={null}
        richTextfieldRef={null}
        keyboardHeight={0}
        handleCustomInsertLink={jest.fn()}
      />,
    );
    Object.values(mockIconMap).forEach(IconComponent => {
      const {toJSON} = render(<IconComponent tintColor="#000" />);
      expect(toJSON()).not.toThrow;
    });
  });
});
