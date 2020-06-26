import React from 'react';
import {View, StyleSheet, Platform, AsyncStorage, ActivityIndicator} from 'react-native';
import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import SubView from '../../../global/components/SubView';
import {Actions} from 'react-native-router-flux';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../../actions/index';

var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;

class EventVideoDescriptionView extends BaseComponentWithoutScroll {
 //{eventUrl: eventUrl, title: document.panelDocumentName}
    constructor(props) {
        super(props);
        this.state = {error: false, visible: true};
    }

    showSpinner() {
        console.log('Show Spinner');
        this.setState({visible: true});
    }

    hideSpinner() {
        console.log('Hide Spinner');
        this.setState({visible: false});
    }

    getWebViewURI() {
        if (this.props.eventUrl) {
            let takeSurveyURL = {uri: this.props.eventUrl};
            return takeSurveyURL;
        }
        return global.BASE_URL;
    }

    onNavigationStateChange(webViewState) {

        if (webViewState.url.indexOf('autoClose') !== -1) {

            //Adding 10 seconds delay to auto close survey screen.
            this.exitTimeout = setTimeout(() => {
                AsyncStorage.setItem(global.getReloadKey, 'true');
                console.log('autoClose');
                this.navigateBack();
            }, 10000);

        }
    }

    navigateBack() {
        Actions.pop({refresh: {notificationNumber: Math.random()}});
        if (this.exitTimeout) {
            //Clear timeout to handle the manual closure of survey screen.
            clearTimeout(this.exitTimeout);
        }
    }

    componentWillMount() {
        if (Platform.OS !== 'ios') {
            AndroidKeyboardAdjust.setAdjustResize();
        }
    }

    renderChild() {
        return (
            <SubView
                title={this.props.title}
                onPress={() => {
                    this.navigateBack();
                }}>
                <View style={this.state.visible === true ? styles.stylOld : styles.styleNew}>
                    {this.state.visible ?
                        (<ActivityIndicator color="#bdbdbd" size="large"
                                            style={styles.ActivityIndicatorStyle}/>) : null}
                    <WebView style={styles.WebViewStyle} source={this.getWebViewURI()}
                             useWebKit={true}
                             javaScriptEnabled={true}
                             domStorageEnabled={true}
                             onLoadStart={() => this.showSpinner()}
                             onLoad={() => this.hideSpinner()}/>
                </View>
            </SubView>);
    }

}

const styles = StyleSheet.create({
    stylOld: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    styleNew: {
        flex: 1,
    },
    WebViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: 40,
    },
    ActivityIndicatorStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
});


function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        error: state.error.message,
        isConnected: state.network.isConnected
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventVideoDescriptionView);
