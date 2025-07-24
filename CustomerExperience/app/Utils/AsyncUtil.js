import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncStorageData {
  constructor(key) {
    this.key = key;
  }

  async removeData() {
    try {
      await AsyncStorage.removeItem(this.key);
    } catch (e) {
      console.log('ERROR_ASYNC_REMOVE_DATA', e);
    }
  }

  async setData(data) {
    try {
      await AsyncStorage.setItem(this.key, data);
    } catch (e) {
      console.log('ERROR_ASYNC_SET_DATA', e);
    }
  }

  async getData() {
    try {
      return await AsyncStorage.getItem(this.key);
    } catch (e) {
      console.log('ERROR_ASYNC_GET_DATA', e);
      return null;
    }
  }

  async setDataAsString(data) {
    try {
      await AsyncStorage.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      console.log('ERROR_ASYNC_SET_DATA_AS_STRING', e);
    }
  }
  async clearAllData() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log('ERROR_ASYNC_CLEAR_ALL_DATA', e);
    }
  }
}
