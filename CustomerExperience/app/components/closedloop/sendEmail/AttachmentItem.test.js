import React from 'react';
import {render} from '@testing-library/react-native';
import AttachmentItem from './AttachmentItem';

jest.mock('../../../Utils/IconUtils', () => ({
  AttachmentIcon: () => null,
  IonIcon: () => null,
}));
jest.mock('../../../Utils/StringUtils', () => ({
  truncateFileName: name => name,
}));

describe('AttachmentItem', () => {
  const item = {fileName: 'document.pdf', mimeType: 'application/pdf'};

  it('renders the file name', () => {
    const {getByText} = render(<AttachmentItem item={item} />);
    expect(getByText('document.pdf')).toBeTruthy();
  });

  it('renders with a long filename', () => {
    const longItem = {fileName: 'a'.repeat(50) + '.pdf', mimeType: 'application/pdf'};
    const {getByText} = render(<AttachmentItem item={longItem} />);
    expect(getByText(longItem.fileName)).toBeTruthy();
  });
});
