import React from 'react';
import {render} from '@testing-library/react-native';
import {View, Text} from 'react-native';
// import { ParentContainer, ChildContainer } from ''; // Adjust the import path as necessary
import {PaddingConstants} from '../styles/padding.constants';
import {ChildContainer, ParentContainer} from './ParentContainer';
import {MarginConstants} from '../styles/margin.constants';

describe('ParentContainer Component', () => {
  it('renders correctly with default styles', () => {
    const {getByTestId} = render(<ParentContainer />);
    const parentContainer = getByTestId('parent-container');
    expect(parentContainer.props.style).toMatchObject({
      padding: PaddingConstants.tab1,
      flex: 1,
    });
  });

  it('applies custom styles passed via style prop', () => {
    const customStyle = {backgroundColor: 'red'};
    const {getByTestId} = render(<ParentContainer style={customStyle} />);
    const parentContainer = getByTestId('parent-container');
    expect(parentContainer.props.style).toMatchObject({
      padding: PaddingConstants.tab1,
      flex: 1,
      backgroundColor: 'red',
    });
  });

  it('renders children components correctly', () => {
    const {getByText} = render(
      <ParentContainer>
        <Text>Child Text</Text>
      </ParentContainer>,
    );
    expect(getByText('Child Text')).toBeTruthy();
  });
});

describe('ChildContainer Component', () => {
  it('renders correctly with default styles', () => {
    const {getByTestId} = render(<ChildContainer />);
    const childContainer = getByTestId('child-container');
    expect(childContainer.props.style).toMatchObject({
      padding: PaddingConstants.halfTab,
      marginVertical: MarginConstants.halfTab,
      flex: 1,
    });
  });

  it('applies custom styles passed via style prop', () => {
    const customStyle = {backgroundColor: 'blue'};
    const {getByTestId} = render(<ChildContainer style={customStyle} />);
    const childContainer = getByTestId('child-container');
    expect(childContainer.props.style).toMatchObject({
      padding: PaddingConstants.halfTab,
      marginVertical: MarginConstants.halfTab,
      flex: 1,
      backgroundColor: 'blue',
    });
  });

  it('renders children components correctly', () => {
    const {getByText} = render(
      <ChildContainer>
        <Text>Child Text</Text>
      </ChildContainer>,
    );
    expect(getByText('Child Text')).toBeTruthy();
  });
});
