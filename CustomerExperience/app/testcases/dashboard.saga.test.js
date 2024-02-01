import {put, takeLatest} from 'redux-saga/effects';
import {fetchDashboard, watchGetDashboard} from '../redux/sagas/dashboardSaga';
import {
  DASHBOARD_RECEIVED,
  GET_DASHBOARD,
} from '../redux/actions/dashboard.actions';

const mockResponse = {
  detractorTicketsCount: {new: 63, pending: 4, resolved: 4, totalTickets: 71},
  primaryStoreId: 40305,
  primaryStoreNPS: {
    benchmarkScore: 0,
    detractorFormattedPercent: 0,
    detractorPercent: 0,
    detractors: 0,
    npsPercentage: 100,
    npsScore: 100,
    passive: 0,
    passiveFormattedPercent: 0,
    passivePercent: 0,
    promoterFormattedPercent: 100,
    promoterPercent: 100,
    promoters: 1,
    smartTotalResponses: '1',
    totalResponses: 1,
  },

  primaryStoreName: 'Delhi',
  productNPSList: [
    {
      NPSScore: {
        benchmarkScore: 0,
        detractorFormattedPercent: 0,
        detractorPercent: 0,
        detractors: 0,
        npsPercentage: 100,
        npsScore: 100,
        passive: 0,
        passiveFormattedPercent: 0,
        passivePercent: 0,
        promoterFormattedPercent: 100,
        promoterPercent: 100,
        promoters: 1,
        smartTotalResponses: '1',
        totalResponses: 1,
      },
      filterName: '38270',
      productName: {name: '38270', id: 2405},
    },
    {
      NPSScore: {
        benchmarkScore: 0,
        detractorFormattedPercent: 0,
        detractorPercent: 0,
        detractors: 0,
        npsPercentage: 100,
        npsScore: 100,
        passive: 0,
        passiveFormattedPercent: 0,
        passivePercent: 0,
        promoterFormattedPercent: 100,
        promoterPercent: 100,
        promoters: 1,
        smartTotalResponses: '1',
        totalResponses: 1,
      },
      filterName: '38820',
      productName: {name: '38820', id: 2610},
    },
  ],
  storeNPSList: [],
  systemPreferences: {businessUnitName: 'Business units'},
  statusCode: 200,
  uniqueAPICallIdentifier: 0,
};
describe('SAGAS', () => {
  it('should dispatch action "GET_NEWS" ', () => {
    const generator = watchGetDashboard();

    expect(generator.next().value).toEqual(
      takeLatest(GET_DASHBOARD, fetchDashboard),
    );
    expect(generator.next().done).toBeTruthy();
  });

  it('should dispatch action "DASHBOARD_RECEIVED" with result from fetch News API', () => {
    const action = {
      token:
        'eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIiwidWlkIjoxNzMyOSwicGlkIjoxMDI2NiwiZXhwIjoxNTk3NjU1NjEwLCJpYXQiOjE1OTcwNTA4MTAsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5xdWVzdGlvbnByby5jb20vIn0.N5z5pzE3QOO7M6G_QEwVYvlsuoXGM1nAtW_ZpMGcngU',
    };
    const generator = fetchDashboard(action);
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({type: DASHBOARD_RECEIVED, response: mockResponse}),
    );
    expect(generator.next().done).toBeTruthy();
  });
});
