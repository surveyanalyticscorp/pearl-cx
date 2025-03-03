import analytics from '@react-native-firebase/analytics';

/****
 Method to send analytics event to firebase console.
 Params -> 
 eventName - Name of the firebase event to log.
 eventParams - Extra info(values) to be passed with event.
 */
export const sendAnalyticsEvent = (eventName, eventParams) => {
  console.log('Firebase Analytics event name - ', eventName);
  console.log('Firebase Analytics event params - ', eventParams);
  analytics().logEvent(eventName, eventParams);
};

export const appendUserInfoToEventParams = appUser => {
  if (appUser && appUser.ID && appUser.appVersion && appUser.panelID) {
    return {
      userID: appUser.ID.toString(),
      appVersion: appUser.appVersion,
      panelID: appUser.panelID.toString(),
    };
  }
};
