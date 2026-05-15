import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import ActionEmailHistory from './ActionEmailHistory';

jest.mock('react-native-render-html', () => ({
  __esModule: true,
  default: () => null,
  defaultSystemFonts: [],
}));

jest.mock('../../../Utils/DownloadUtils', () => ({
  downloadFile: jest.fn(() => Promise.resolve({path: () => '/tmp/file'})),
}));

jest.mock('../../../Utils/PermissionUtils', () => ({
  getDownloadPermissionAndroid: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('../../../Utils/IconUtils', () => ({
  AttachmentIcon: () => null,
}));

jest.mock('../../../Utils/StringUtils', () => ({
  __esModule: true,
  default: {truncate: jest.fn(s => s)},
}));

const mockStore = configureStore([]);

const makeStore = (overrides = {}) =>
  mockStore({
    global: {authToken: 'tok'},
    dashboard: {
      ticketActionHistory: {
        summary: {
          data: {action: {subject: 'Test subject'}, totalAction: 1},
        },
        details: {
          data: [
            {
              id: 1,
              createdAt: '2024-01-01T10:00:00Z',
              emailBody: '<p>Hello</p>',
              emailSendBy: 'agent@test.com',
              attachments: [],
            },
          ],
        },
        ...overrides,
      },
    },
  });

const wrap = (ui, store = makeStore()) => (
  <Provider store={store}>{ui}</Provider>
);

describe('ActionEmailHistory', () => {
  it('renders header with "Action history" text', () => {
    const {getByText} = render(wrap(<ActionEmailHistory />));
    expect(getByText('Action history')).toBeTruthy();
  });

  it('renders subject from Redux summary', () => {
    const {getByText} = render(wrap(<ActionEmailHistory />));
    expect(getByText('Test subject')).toBeTruthy();
  });

  it('returns empty view when details is an empty object', () => {
    const store = makeStore({details: {}});
    const {queryByText} = render(wrap(<ActionEmailHistory />, store));
    expect(queryByText('Action history')).toBeNull();
  });

  it('renders sender name in action history item', () => {
    const {getByText} = render(wrap(<ActionEmailHistory />));
    expect(getByText('agent@test.com')).toBeTruthy();
  });

  it('uses fallback sender when emailSendBy is missing', () => {
    const store = makeStore({
      details: {
        data: [{id: 2, createdAt: '2024-01-01', emailBody: '<p>Hi</p>', attachments: []}],
      },
    });
    const {getByText} = render(wrap(<ActionEmailHistory />, store));
    expect(getByText('Default sender')).toBeTruthy();
  });

  it('does not render Attachments section when attachments list is empty', () => {
    const {queryByText} = render(wrap(<ActionEmailHistory />));
    expect(queryByText('Attachments')).toBeNull();
  });

  it('renders Attachments section when attachments are present', () => {
    const store = makeStore({
      details: {
        data: [
          {
            id: 1,
            createdAt: '2024-01-01T10:00:00Z',
            emailBody: '<p>Hello</p>',
            emailSendBy: 'agent@test.com',
            attachments: [{fileName: 'doc.pdf', mimeType: 'application/pdf', path: 'http://example.com/doc.pdf'}],
          },
        ],
      },
    });
    const {getByText} = render(wrap(<ActionEmailHistory />, store));
    expect(getByText('Attachments')).toBeTruthy();
    expect(getByText('doc.pdf')).toBeTruthy();
  });

  it('uses default subject fallback when summary action subject is missing', () => {
    const store = makeStore({
      summary: {data: {action: {}, totalAction: 0}},
    });
    const {getByText} = render(wrap(<ActionEmailHistory />, store));
    expect(getByText('Default subject')).toBeTruthy();
  });
});
