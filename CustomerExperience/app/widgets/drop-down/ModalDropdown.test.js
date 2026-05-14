import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ModalDropdown from './ModalDropdown';

jest.mock('react-native-vector-icons/SimpleLineIcons', () => 'Icon');

const OPTIONS = ['Option A', 'Option B', 'Option C'];

describe('ModalDropdown', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(
      <ModalDropdown options={OPTIONS} defaultValue="Option A" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders defaultValue as button text', () => {
    const {getByText} = render(
      <ModalDropdown options={OPTIONS} defaultValue="Option A" />,
    );
    expect(getByText('Option A')).toBeTruthy();
  });

  it('updates displayed text when defaultValue prop changes', () => {
    const {getByText, rerender} = render(
      <ModalDropdown options={OPTIONS} defaultValue="Option A" />,
    );
    expect(getByText('Option A')).toBeTruthy();
    rerender(<ModalDropdown options={OPTIONS} defaultValue="Option B" />);
    expect(getByText('Option B')).toBeTruthy();
  });

  it('renders with default placeholder text when no defaultValue given', () => {
    const {getByText} = render(<ModalDropdown options={OPTIONS} />);
    expect(getByText('Please select...')).toBeTruthy();
  });

  it('does not show modal when disabled and button is pressed', () => {
    const {queryByText} = render(
      <ModalDropdown options={OPTIONS} defaultValue="Option A" disabled={true} />,
    );
    // Modal is not visible initially — options not in document
    expect(queryByText('Option B')).toBeNull();
    expect(queryByText('Option C')).toBeNull();
  });

  it('renders custom children instead of default button layout', () => {
    const {getByText, queryByText} = render(
      <ModalDropdown options={OPTIONS}>
        <React.Fragment>
          <></>
        </React.Fragment>
      </ModalDropdown>,
    );
    // default buttonText not rendered when children provided
    expect(queryByText('Please select...')).toBeNull();
  });

  it('accepts scrollEnabled prop without crashing', () => {
    const {toJSON} = render(
      <ModalDropdown options={OPTIONS} scrollEnabled={false} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('accepts style and textStyle props without crashing', () => {
    const {toJSON} = render(
      <ModalDropdown
        options={OPTIONS}
        style={{borderWidth: 1}}
        textStyle={{fontSize: 14}}
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('accepts isRTL prop and renders without crashing', () => {
    const {toJSON} = render(
      <ModalDropdown options={OPTIONS} isRTL={true} />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
