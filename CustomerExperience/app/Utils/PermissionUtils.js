import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';

export const getDownloadPermissionAndroid = async () => {
  if (Platform.OS !== 'android') return true;

  // WRITE_EXTERNAL_STORAGE is only meaningful up to Android 10 (API 29)
  if (Platform.Version >= 30) return true;

  const permission = PermissionsAndroid.PERMISSIONS?.WRITE_EXTERNAL_STORAGE;
  if (!permission) return false;

  try {
    const granted = await PermissionsAndroid.request(permission, {
      title: 'File Download Permission',
      message: 'Your permission is required to save Files to your device',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.log('err', err);
    return false;
  }
};
