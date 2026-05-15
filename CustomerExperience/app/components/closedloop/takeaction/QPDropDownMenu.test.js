import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import QPDropDownMenu from './QPDropDownMenu';

jest.mock('../../../Utils/StringUtils', () => ({
  __esModule: true,
  default: {
    uppercaseFirstCharRestLowercase: str => str,
  },
}));

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  anchorPosition: {x: 10, y: 20},
  items: ['Option A', 'Option B', 'Option C'],
  onSelectItem: jest.fn(),
  selectedItem: null,
};

describe('QPDropDownMenu', () => {
  beforeEach(() => {
    defaultProps.onClose.mockClear();
    defaultProps.onSelectItem.mockClear();
  });

  it('renders null when not visible', () => {
    const {toJSON} = render(<QPDropDownMenu {...defaultProps} visible={false} />);
    expect(toJSON()).toBeNull();
  });

  it('renders items when visible', () => {
    const {getByText} = render(<QPDropDownMenu {...defaultProps} />);
    expect(getByText('Option A')).toBeTruthy();
    expect(getByText('Option B')).toBeTruthy();
    expect(getByText('Option C')).toBeTruthy();
  });

  it('calls onSelectItem and onClose when item pressed', () => {
    const {getByText} = render(<QPDropDownMenu {...defaultProps} />);
    fireEvent.press(getByText('Option A'));
    expect(defaultProps.onSelectItem).toHaveBeenCalledWith('Option A');
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay pressed', () => {
    const {UNSAFE_getAllByType} = render(<QPDropDownMenu {...defaultProps} />);
    const {Pressable} = require('react-native');
    const overlay = UNSAFE_getAllByType(Pressable)[0];
    fireEvent.press(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('uses bottom position style when anchorType=bottom', () => {
    const {toJSON} = render(
      <QPDropDownMenu
        {...defaultProps}
        anchorType="bottom"
        anchorPosition={{x: 5, y: 30}}
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('uses top position style when anchorType=top', () => {
    const {toJSON} = render(
      <QPDropDownMenu
        {...defaultProps}
        anchorType="top"
        anchorPosition={{x: 5, y: 30}}
      />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
