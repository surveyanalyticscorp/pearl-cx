import React, { Component } from 'react';

import {
    View,
    WebView,
    Platform
} from 'react-native';
var DeviceInfo = require('react-native-device-info');
import { Actions, ActionConst } from 'react-native-router-flux';
import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import KeyboardSpacer from 'react-native-keyboard-spacer';
var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'

class Feedback extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
    }

    getWebViewURI() {
        let takeSurveyURL = { uri: "https://www.questionpro.com/t/ANJcmZhasp?" + this.getCustomVars() };
        console.log(takeSurveyURL);
        return takeSurveyURL;

    }
    componentDidMount(){
    }

    getCustomVars() {
        let custom2 = global.appUser.ID;
        let custom3 = global.appUser.panelID;
        let custom4 = global.APP_VERSION;
        let custom5 = Platform.OS.toString();
        let custom6 = DeviceInfo.getDeviceName();
        let custom7 = DeviceInfo.getSystemVersion();
        let custom8 = DeviceInfo.getDeviceLocale();
        return ("custom2=" + custom2 + "&custom3=" + custom3 + "&custom4=" + custom4 + "&custom5=" + custom5 + "&custom6=" + custom7 + "&custom8=" + custom8);

    }
    componentWillMount() {
        super.componentWillMount();
        if (Platform.OS != 'ios') {
            AndroidKeyboardAdjust.setAdjustPan();
        }
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        console.log("Unmounting Feedback");
        if (this.webView) {
            this.webView.props.source = { uri: "http://www.google.com" };
        }
    }

    renderChild() {
        console.log("Feedback Tab");
        if (!this.props.error) {
            return (
                <View style={{ flex: 1 }}>
                    <WebView
                        ref={ref => this.webView = ref}
                        source={this.getWebViewURI()}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}

                        startInLoadingState={true} />
                    <KeyboardSpacer />
                </View>
            );
        }
        return (<View style={{ flex: 1 }} />);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        error: state.error.message,
        isConnected : state.network.isConnected
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
