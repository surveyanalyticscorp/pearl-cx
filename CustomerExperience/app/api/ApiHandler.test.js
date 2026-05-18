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

  it('should handle getNotificationData with non-200 statusCode', async () => {
    const badResponse = {statusCode: 400, body: 'error'};
    WebServiceHandler.get.mockResolvedValue(badResponse);

    await apiHandler.getNotificationData(
      header,
      successCallback,
      errorCallback,
    );

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle clearNotification with non-200 statusCode', async () => {
    const badResponse = {statusCode: 400, body: 'error'};
    WebServiceHandler.postNew.mockResolvedValue(badResponse);

    await apiHandler.clearNotification(
      header,
      data,
      successCallback,
      errorCallback,
    );

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle getNotificationData with null response', async () => {
    WebServiceHandler.get.mockResolvedValue(null);

    await apiHandler.getNotificationData(
      header,
      successCallback,
      errorCallback,
    );

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle clearNotification with null response', async () => {
    WebServiceHandler.postNew.mockResolvedValue(null);

    await apiHandler.clearNotification(
      header,
      data,
      successCallback,
      errorCallback,
    );

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should call generateEmailWithAI with correct parameters', async () => {
    const apiKey = 'mockApiKey';
    const url = 'https://api.example.com/email';
    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await apiHandler.generateEmailWithAI(
      url,
      apiKey,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      url,
      {'api-key': apiKey},
      data,
    );
    expect(successCallback).toHaveBeenCalledWith(mockResponse);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle error for generateEmailWithAI', async () => {
    const apiKey = 'mockApiKey';
    const url = 'https://api.example.com/email';
    WebServiceHandler.postNew.mockRejectedValue(mockError);

    await apiHandler.generateEmailWithAI(
      url,
      apiKey,
      data,
      successCallback,
      errorCallback,
    );

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      url,
      {'api-key': apiKey},
      data,
    );
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalledWith(mockError);
  });

  it('should use default empty data object when not provided in getCXDetractorTicket', async () => {
    WebServiceHandler.postNew.mockResolvedValue(mockResponse);

    await apiHandler.getCXDetractorTicket(token, undefined, successCallback);

    expect(WebServiceHandler.postNew).toHaveBeenCalledWith(
      CX_DETRACTOR_TICKETS,
      header,
      {},
    );
    expect(successCallback).toHaveBeenCalledWith(mockResponse);
  });

  it('should use default empty errorCallback when not provided in getFeedbackResponseList', async () => {
    WebServiceHandler.postNew.mockRejectedValue(mockError);

    // Call without errorCallback - should use default
    await apiHandler.getFeedbackResponseList(token, data, successCallback);

    expect(WebServiceHandler.postNew).toHaveBeenCalled();
    expect(successCallback).not.toHaveBeenCalled();
  });
});
