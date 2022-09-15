import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import QPSpinner from './QPSpinner';

const QPWebView = (props) => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <WebView
        //Appending timestamp to update page everytime is loads.
        source={{
          uri: props.uri + '&t=' + Date.now(),
          headers: {'Auth-Token': props.authToken},
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => {
          return <QPSpinner />;
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default QPWebView;
