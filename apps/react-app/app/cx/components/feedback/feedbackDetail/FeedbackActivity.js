import React, { Component } from 'react';

import {
    View,
    WebView,
} from 'react-native';
import LoadingIndicator from "../../LoadingIndicator";

const feedbackActivityURI = 'https://github.com/facebook/react-native';

class FeedbackActivity extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    //Appending timestamp to update page everytime is loads.
                    source={{ uri: this.props.uri +"&"+Date.now(),headers: {"Auth-Token": this.props.authToken} }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={()=>{return <LoadingIndicator visible/>}}
                />
            </View>
        );
    }

}

export default FeedbackActivity;