declare module 'react-native-intercept-sdk' {
  interface SurveySDKType {
    showSurvey(): void;
  }

  const SurveySDK: SurveySDKType;
  export default SurveySDK;
}
