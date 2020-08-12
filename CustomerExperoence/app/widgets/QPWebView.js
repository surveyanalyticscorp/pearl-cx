import React from 'react';
import {View} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
const feedbackSurveyURI = 'https://github.com/facebook/react-native';
import {WebView} from 'react-native-webview';
const QPWebView = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <WebView
        //Appending timestamp to update page everytime is loads.
        source={{
          uri: props.uri + '&' + Date.now(),
          headers: {'Auth-Token': props.authToken},
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => {
          return <DotIndicator color="#2589E3" count={3} size={10} visible />;
        }}
      />
    </View>
  );
};

export default QPWebView;
