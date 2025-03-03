import WebServiceHandler from './WebServiceHandler';
import {apiHandler} from './ApiHandler';
import {
  CX_DETRACTOR_TICKETS,
  CX_GET_ALL_RESPONSE,
  CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
  CX_GET_NOTIFICATION_LIST,
  CX_CLEAR_NOTIFICATION_LOGS,
} from './Constant';

jest.mock('./WebServiceHandler'); // Mock the WebServiceHandler

describe('ApiHandler', () => {
  const token = 'mockToken';
  const data = {key: 'value'};
  const header = {'Auth-Token': token};
  const mockResponse = {statusCode: 200, body: 'mockResponseBody'};
  const mockError = new Error('Mock Error');
  const successCallback = jest.fn();
  const errorCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all previous mock data
  });

  it('should call WebServiceHandler.postNew for getCXDetractorTicket', async () => {
    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await apiHandler.getCXDetractorTicket(
      token,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_DETRACTOR_TICKETS,
      header,
      data,
    );
    expect(successCallback).toHaveBeenCalledWith(mockResponse);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle error for getCXDetractorTicket', async () => {
    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await apiHandler.getCXDetractorTicket(
      token,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_DETRACTOR_TICKETS,
      header,
      data,
    );
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalledWith(mockError);
  });

  it('should call WebServiceHandler.postNew for getFeedbackResponseList', async () => {
    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await apiHandler.getFeedbackResponseList(
      token,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_GET_ALL_RESPONSE,
      header,
      data,
    );
    expect(successCallback).toHaveBeenCalledWith(mockResponse);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle error for getFeedbackResponseList', async () => {
    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await apiHandler.getFeedbackResponseList(
      token,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_GET_ALL_RESPONSE,
      header,
      data,
    );
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalledWith(mockError);
  });

  it('should call WebServiceHandler.postNew for getSegmentList', async () => {
    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await apiHandler.getSegmentList(
      token,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
      header,
      data,
    );
    expect(successCallback).toHaveBeenCalledWith(mockResponse);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle error for getSegmentList', async () => {
    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await apiHandler.getSegmentList(
      token,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
      header,
      data,
    );
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalledWith(mockError);
  });

  it('should call WebServiceHandler.get for getNotificationData', async () => {
    WebServiceHandler.get.mockResolvedValue(mockResponse);

    await apiHandler.getNotificationData(
      header,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.get).toHaveBeenCalledWith(
      CX_GET_NOTIFICATION_LIST,
      header,
      {},
    );
    expect(successCallback).toHaveBeenCalledWith(mockResponse.body);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle error for getNotificationData', async () => {
    WebServiceHandler.get.mockRejectedValue(mockError);

    await apiHandler.getNotificationData(
      header,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.get).toHaveBeenCalledWith(
      CX_GET_NOTIFICATION_LIST,
      header,
      {},
    );
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalledWith(mockError);
  });

  it('should call WebServiceHandler.postNew for clearNotification', async () => {
    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await apiHandler.clearNotification(
      header,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_CLEAR_NOTIFICATION_LOGS,
      header,
      data,
    );
    expect(successCallback).toHaveBeenCalledWith(mockResponse.body);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle error for clearNotification', async () => {
    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await apiHandler.clearNotification(
      header,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_CLEAR_NOTIFICATION_LOGS,
      header,
      data,
    );
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalledWith(mockError);
  });
});
