/*@flow*/

import React, {Component} from 'react';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    Dimensions,
    Image,
    NativeEventEmitter,
    NativeModules,
    Navigator,
    NetInfo,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    UIManager,
    View
} from 'react-native';
import {ActionBarModule} from '../../global/native-modules/NativeModules';
import {Actions} from 'react-native-router-flux';
import CustomText from '../ui/CustomText';
import Toast from 'react-native-root-toast';
import {ConnectivityRenderer} from 'react-native-offline';
import * as Messages from '../api/messages';
import {utils} from '../../global/Utils';
import LoadingIndicator from "../../cx/components/LoadingIndicator";

var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
const { height, width } = Dimensions.get('window');

export default class BaseComponentWithoutScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            error: false,
            showLoader: false,
            errorMessage: '',
            refreshEnabled: true
        };
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    updateContextMenuAndTitle(titleData) {
        console.log(titleData);
        ActionBarModule.updateTitleAndMenu(titleData);
    }

    onPopScreen() {
        if (this.props.navigator) {
            ActionBarModule.toggleBackButton(this.props.navigator.getCurrentRoutes().length > 2);
            ActionBarModule.updateTitleAndMenu(titleAndMenuStack.pop());
            this.props.navigator.pop();
        } else {
            Actions.pop();
        }
    }

    componentWillMount() {

        if (Platform.OS != 'ios') {
            AndroidKeyboardAdjust.setAdjustNothing();
        }
    }

    componentWillUnmount() {

    }

    getBackGroundImage() {
        if (Platform.OS != 'ios') {
            return require('../images/background.png');
        }
        let iosImage = { uri: 'background.png' };
        return iosImage;
    }

    onPushScreen(_name, _component, _data, _stackData = {}) {
        this.props.navigator.push({
            name: _name,
            component: _component,
            data: _data
        });
        console.log("Pushed data  : " + _stackData);
        titleAndMenuStack.push(_stackData);
        ActionBarModule.toggleBackButton(true);
    }

    onPushScreenWithClearStack(_name, _component, _data = {}) {
        this.props.navigator.popToTop();
        this.props.navigator.replace({
            name: _name,
            component: _component,
            data: _data
        });
        console.log("Pushing with clear stack");
        titleAndMenuStack = [];
        ActionBarModule.toggleBackButton(false);
    }

    handleError(error) {
        console.log("Error-> " + error);
        this.setState({ dataLoaded: false, error: true, showLoader: false, errorMessage: error });
        utils.showToastMessage(""+error.message? error.message : "There was an error processing this request!");
        this.props.updateLoadingStatus(false);
    }

    prepareForNetworkRequest() {
        this.setState({ dataLoaded: false, error: false, showLoader: true });
    }

    showToastMessage(aMessage) {
        if (aMessage.length > 0) {
            // Add a Toast on screen.
            let toast = Toast.show(aMessage, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                onShow: () => {
                    // calls on toast\`s appear animation start
                },
                onShown: () => {
                    // calls on toast\`s appear animation end.
                },
                onHide: () => {
                    // calls on toast\`s hide animation start.
                },
                onHidden: () => {
                    // calls on toast\`s hide animation end.
                }
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ConnectivityRenderer>
                    {
                        isConnected => {
                            if(isConnected) return null; return(
                                <View style={styles.errorContainer}>
                                    <CustomText style={{ color: '#901a1c' }}>
                                        {Messages.NO_INTERNET}
                                    </CustomText>
                                 </View>);
                        }
                    }
                </ConnectivityRenderer>

                <LoadingIndicator visible={this.props.isLoading} style={{zIndex:10}} />

                <View style={[styles.content, {zIndex: this.props.isConnected? 3: 1}]}>
                    {this.renderChild()}
                </View>

            </View>
        );
    }
    showErrorToastAndClear() {
        this.showToastMessage(this.props.error);
        this.props.clearError();
    }

    getSpinner() {
        let spinner = (this.props.isLoading) ? (
            <ActivityIndicator
                color={'#003566'}
                animating={true}
                size="large"
                style={{ flex: 1 }}
            />
        ) : (
                null
            );
        return spinner;
    }

    reloadContent() {
        //child should implement this if needed.
    }

    scrollToStart() {
        if (this.refs.mainScrollView) {
            this.refs.mainScrollView.getScrollResponder().scrollTo({ x: 0, y: 0, animated: false });
        }
    }

};

var styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'

    },
    errorContainer: {
        height: 50,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 12,
        backgroundColor: '#ffffff'
    },

    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        alignSelf: 'stretch',
    },
});
