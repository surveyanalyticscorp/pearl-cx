import React from 'react';
import RenderSegmentDashboardData from './RenderSegmentDashboardData';
import {render, screen} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const initialState = {
  dashboard: {
    dashboardData: {
      surveyCount: 3,
      detractorTicketsCount: {
        new: {
          high: 0,
          critical: 0,
          low: 17,
          totalTickets: 17,
          medium: 0,
        },
        escalated: {
          high: 0,
          critical: 0,
          low: 0,
          totalTickets: 0,
          medium: 0,
        },
        open: {
          high: 0,
          critical: 0,
          low: 0,
          totalTickets: 0,
          medium: 0,
        },
        resolved: {
          high: 0,
          critical: 0,
          low: 0,
          totalTickets: 0,
          medium: 0,
        },
      },
      systemPreferences: {
        businessUnitName: 'Segments',
      },
      primaryStoreName: 'Main Segment',
      scoringModel: 0,
      primaryStoreId: 191074,
      languageID: 0,
      primaryStoreNPS: {
        totalResponses: 23,
        csatScore: 21.73913043478261,
        passivePercent: 13.043478260869565,
        questionTotal: 0,
        npsPercentage: -43.47826086956522,
        smartTotalResponses: '23',
        promoterFormattedPercent: 21.73913043478261,
        passive: 3,
        questionMeanScore: 0,
        detractorPercent: 65.21739130434783,
        benchmarkScore: 0,
        detractors: 15,
        detractorFormattedPercent: 65.21739130434783,
        npsScore: -43.47826086956522,
        promoters: 5,
        csatMeanAverage: 6.478260869565218,
        promoterPercent: 21.73913043478261,
        passiveFormattedPercent: 13.043478260869565,
      },
      storeNPSList: [
        {
          NPSScore: {
            totalResponses: 23,
            csatScore: 21.73913043478261,
            passivePercent: 13.043478260869565,
            questionTotal: 0,
            npsPercentage: -43.47826086956522,
            smartTotalResponses: '23',
            promoterFormattedPercent: 21.73913043478261,
            passive: 3,
            questionMeanScore: 0,
            detractorPercent: 65.21739130434783,
            benchmarkScore: 0,
            detractors: 15,
            detractorFormattedPercent: 65.21739130434783,
            npsScore: -43.47826086956522,
            promoters: 5,
            csatMeanAverage: 6.478260869565218,
            promoterPercent: 21.73913043478261,
            passiveFormattedPercent: 13.043478260869565,
          },
          DetractorTicketsCount: {
            new: 36,
            pending: 5,
            totalTickets: 41,
            resolved: 0,
          },
          filterName: 'Main Segment',
          storeName: 'Main Segment',
          storeId: 191074,
        },
        {
          NPSScore: {
            totalResponses: 0,
            csatScore: 0,
            passivePercent: 0,
            questionTotal: 0,
            npsPercentage: 0,
            smartTotalResponses: '0',
            promoterFormattedPercent: 0,
            passive: 0,
            questionMeanScore: 0,
            detractorPercent: 0,
            benchmarkScore: 0,
            detractors: 0,
            detractorFormattedPercent: 0,
            npsScore: 0,
            promoters: 0,
            csatMeanAverage: 0,
            promoterPercent: 0,
            passiveFormattedPercent: 0,
          },
          DetractorTicketsCount: {
            new: 14,
            pending: 0,
            totalTickets: 14,
            resolved: 0,
          },
          filterName: 'Office',
          storeName: 'Office',
          storeId: 211423,
        },
        {
          NPSScore: {
            totalResponses: 0,
            csatScore: 0,
            passivePercent: 0,
            questionTotal: 0,
            npsPercentage: 0,
            smartTotalResponses: '0',
            promoterFormattedPercent: 0,
            passive: 0,
            questionMeanScore: 0,
            detractorPercent: 0,
            benchmarkScore: 0,
            detractors: 0,
            detractorFormattedPercent: 0,
            npsScore: 0,
            promoters: 0,
            csatMeanAverage: 0,
            promoterPercent: 0,
            passiveFormattedPercent: 0,
          },
          DetractorTicketsCount: {
            new: 3,
            pending: 0,
            totalTickets: 3,
            resolved: 0,
          },
          filterName: 'Playground',
          storeName: 'Playground',
          storeId: 211425,
        },
      ],
      languageCode: 'en',
      productNPSList: [],
      languageName: 'English',
    },
  },
};

describe('RenderSegmentDashboardData', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });

  const renderComponent = (store_ = mockStore(initialState)) => {
    return render(
      <Provider store={store_ ?? store}>
        <RenderSegmentDashboardData />
      </Provider>,
    );
  };

  it('should render RenderSegmentDashboardData', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('render-info-title')).toBeTruthy();
    expect(screen.getByText('Main Segment NPS')).toBeTruthy();
  });
});
