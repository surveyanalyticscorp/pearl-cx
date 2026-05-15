import React from 'react';
import {render} from '@testing-library/react-native';
import CustomKeyboardToolbar from './CustomKeyboardToolbar';

jest.mock('react-native-pell-rich-editor', () => ({
  RichToolbar: ({children}) => {
    const {View} = require('react-native');
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
});
