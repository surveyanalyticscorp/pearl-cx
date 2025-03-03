import React from 'react';
import IconAndTitleText from './IconAndTitleText';
import {MaterialIcons} from '../../../Utils/IconUtils';
import {render} from '@testing-library/react-native';

// write tests for this component

describe('IconAndTitleText', () => {
  it('renders correctly', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders text correctly', () => {
    const testText = 'Create new ticket';
    const {getByText} = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={testText}
      />,
    );
    expect(getByText(testText)).toBeTruthy();
  });

  it('renders correctly with no icon', () => {
    const tree = render(
      <IconAndTitleText icon={null} title={'Create new ticket'} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with no title', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={null}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with no icon and no title', () => {
    const tree = render(<IconAndTitleText icon={null} title={null} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom color', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        color={'#000'}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom font size', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        fontSize={16}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom font weight', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        fontWeight={'bold'}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom icon color', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        iconColor={'#000'}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom title color', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        titleColor={'#000'}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom icon and title color', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        iconColor={'#000'}
        titleColor={'#000'}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom icon and title font size', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        iconFontSize={16}
        titleFontSize={16}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom icon and title font weight', () => {
    const tree = render(
      <IconAndTitleText
        icon={<MaterialIcons name={'call'} size={14} color={'#fff'} />}
        title={'Create new ticket'}
        iconFontWeight={'bold'}
        titleFontWeight={'bold'}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); // end describe
