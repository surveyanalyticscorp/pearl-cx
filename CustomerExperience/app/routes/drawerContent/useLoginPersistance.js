import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  EMAIL: '@login_email',
  ACCESS_CODE: '@access_code',
};

const useLoginPersistence = () => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved credentials on mount
  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setIsLoading(true);
      const savedEmail = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
      const savedAccessCode = await AsyncStorage.getItem(
        STORAGE_KEYS.ACCESS_CODE,
      );

      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedAccessCode) {
        setAccessCode(savedAccessCode);
      }
      console.log('useLoginPersistence loaded:', savedEmail, savedAccessCode);
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCredentials = async (emailValue, accessCodeValue) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EMAIL, emailValue);
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_CODE, accessCodeValue);
      setEmail(emailValue);
      setAccessCode(accessCodeValue);
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const clearCredentials = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.EMAIL,
        STORAGE_KEYS.ACCESS_CODE,
      ]);
      setEmail('');
      setAccessCode('');
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  };

  return {
    email,
    accessCode,
    isLoading,
    saveCredentials,
    clearCredentials,
  };
};

export default useLoginPersistence;
