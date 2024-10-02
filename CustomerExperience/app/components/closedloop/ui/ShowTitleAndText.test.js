import React from 'react';
import {render} from '@testing-library/react-native';
import ShowTitleAndText from './ShowTitleAndText';

describe('ShowTitleAndText', () => {
  it('renders correctly', () => {
    const tree = render(<ShowTitleAndText />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title', () => {
    const tree = render(<ShowTitleAndText title="title" />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with subText', () => {
    const tree = render(<ShowTitleAndText subText="subText" />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with isSubtextHighlighted', () => {
    const tree = render(<ShowTitleAndText isSubtextHighlighted={true} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title and subText', () => {
    const tree = render(<ShowTitleAndText title="title" subText="subText" />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title, subText and isSubtextHighlighted', () => {
    const tree = render(
      <ShowTitleAndText
        title="title"
        subText="subText"
        isSubtextHighlighted={true}
      />,
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with title, subText and isSubtextHighlighted', () => {
    const tree = render(
      <ShowTitleAndText
        title="title"
        subText="subText"
        isSubtextHighlighted={true}
      />,
    );
    expect(tree).toMatchSnapshot();
  });
});
