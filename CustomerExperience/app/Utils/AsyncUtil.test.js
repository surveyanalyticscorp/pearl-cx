// __tests__/AsyncUtil.test.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageData from './AsyncUtil'; // Update the path to the actual path of your AsyncUtil.js file

describe('AsyncStorageData', () => {
  const key = 'testKey';
  const asyncStorageData = new AsyncStorageData(key);

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('setData should call AsyncStorage.setItem with correct arguments', async () => {
    const data = 'testData';
    await asyncStorageData.setData(data);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, data);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  test('getData should call AsyncStorage.getItem with correct arguments and return parsed data', async () => {
    const data = JSON.stringify({name: 'test'});
    AsyncStorage.getItem.mockResolvedValueOnce(data);

    const result = await asyncStorageData.getData();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(JSON.parse(result)).toEqual({name: 'test'});
  });

  test('getData should return null if no data is found', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const result = await asyncStorageData.getData();
    expect(result).toBeNull();
  });

  test('removeData should call AsyncStorage.removeItem with correct arguments', async () => {
    await asyncStorageData.removeData();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
  });

  test('setDataAsString should call AsyncStorage.setItem with JSON stringified data', async () => {
    const data = {name: 'test'};
    await asyncStorageData.setDataAsString(data);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(data),
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  test('getData should log an error if AsyncStorage.getItem fails', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('AsyncStorage error'));

    const result = await asyncStorageData.getData();

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'ERROR_ASYNC_GET_DATA',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
