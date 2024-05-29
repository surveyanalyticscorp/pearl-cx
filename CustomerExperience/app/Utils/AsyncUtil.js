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
}

// import { useState, useEffect, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const useAsyncStorage = (key) => {
//   const [storedValue, setStoredValue] = useState(null);

//   // Fetch data from AsyncStorage
//   const getStoredValue = useCallback(async () => {
//     try {
//       const value = await AsyncStorage.getItem(key);
//       setStoredValue(value ? JSON.parse(value) : null);
//     } catch (error) {
//       console.error('Failed to load value from AsyncStorage:', error);
//     }
//   }, [key]);

//   // Set data to AsyncStorage
//   const setValue = useCallback(
//     async (value) => {
//       try {
//         const valueToStore = value instanceof Function ? value(storedValue) : value;
//         setStoredValue(valueToStore);
//         await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
//       } catch (error) {
//         console.error('Failed to set value in AsyncStorage:', error);
//       }
//     },
//     [key, storedValue]
//   );

//   // Remove data from AsyncStorage
//   const removeValue = useCallback(async () => {
//     try {
//       setStoredValue(null);
//       await AsyncStorage.removeItem(key);
//     } catch (error) {
//       console.error('Failed to remove value from AsyncStorage:', error);
//     }
//   }, [key]);

//   // Load data from AsyncStorage when the component mounts
//   useEffect(() => {
//     getStoredValue();
//   }, [getStoredValue]);

//   return [storedValue, setValue, removeValue];
// };

// export default useAsyncStorage;
