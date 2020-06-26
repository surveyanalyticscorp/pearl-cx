import React from 'react';
import {View, StyleSheet, Platform, AsyncStorage, ActivityIndicator} from 'react-native';
import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import SubView from '../../../global/components/SubView';
import {Actions} from 'react-native-router-flux';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../../actions/index';
const isImageUrl = require('is-image-url');
const isVideo = require('is-video');
var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;

class DocumentCollaborateViewer extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);
        this.state = {error: false, visible: true};
        this.processAPIResponse = this.processAPIResponse.bind(this);
    }

    processAPIResponse(response) {
        console.log(response)
    }

    showSpinner() {
        console.log('Show Spinner');
        this.setState({visible: true});
    }

    hideSpinner() {
        console.log('Hide Spinner');
        this.setState({visible: false});
        if(Platform.OS === 'android'){
            let url = "javascript:(function() {"+"document.querySelector('[role=\"toolbar\"]').remove();})()"
            if(this.webView){
                this.webView.injectJavaScript(url);
            }
        }
    }

    isImageURL(url){
        return isImageUrl(url);
    }
    isVideoURL(url){
        return isVideo(url);
    }
    getWebViewURI() {
        if (this.props.documentUrl) {
            let url = this.props.documentUrl;

            if(Platform.OS === 'android' && !isImageUrl(url) && !isVideo(url)){
                url = "https://docs.google.com/gview?embedded=true&url="+ url;
            }
            return {uri: url};

        }
        return {uri:global.BASE_URL};
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

    getTitle = () => {
        if (this.props.documentUrl) {
            var filename = this.props.documentUrl.substring(this.props.documentUrl.lastIndexOf('/')+1);
            return filename
        }
        return ""

    }

    renderChild() {

        return (
            <SubView
                title={this.getTitle()}
                onPress={() => {
                    this.navigateBack();
                }}>
                <View style={this.state.visible === true ? styles.stylOld : styles.styleNew}>
                    {this.state.visible ?
                        (<ActivityIndicator color="#bdbdbd" size="large"
                                            style={styles.ActivityIndicatorStyle}/>) : null}
                    <WebView
                        ref = {ref=> this.webView =ref}
                        style={styles.WebViewStyle} source={this.getWebViewURI()}
                        useWebKit={true}
                        originWhitelist={['*']}
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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentCollaborateViewer);
