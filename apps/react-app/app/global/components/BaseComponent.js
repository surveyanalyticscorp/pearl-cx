/*@flow*/

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  ImageBackground,
  NetInfo,
  Platform,
  RefreshControl,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Dimensions
} from 'react-native';
import {
  ActionBarModule,
} from '../../global/native-modules/NativeModules';
import CustomText from '../ui/CustomText';
import Toast from 'react-native-root-toast';
import { ConnectivityRenderer } from 'react-native-offline';
import * as Messages from '../api/messages';
import QPProgressBar from '../../global/widgets/QPProgressBar';
const { height, width } = Dimensions.get('window');
import {utils} from '../../global/Utils';
import LoadingIndicator from "../../cx/components/LoadingIndicator";
var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
class BaseComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      dataLoaded: false,
      error: false,
      showLoader: false,
      isConnected: null,
      errorMessage: '',
      refreshEnabled: true
    };
  }

  updateContextMenuAndTitle(titleData) {
    console.log(titleData);
    ActionBarModule.updateTitleAndMenu(titleData);
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
    // this.props.navigator.push({
    //   name: _name,
    //   component: _component,
    //   data: _data
    // });
    // console.log("Pushed data  : " + _stackData);
    titleAndMenuStack.push(_stackData);
    ActionBarModule.toggleBackButton(true);
  }

  onPushScreenWithClearStack(_name, _component, _data = {}) {
    console.log("Length1: " + this.props.navigator.getCurrentRoutes().length);
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

  onPopScreen() {
    ActionBarModule.toggleBackButton(this.props.navigator.getCurrentRoutes().length > 2);
    ActionBarModule.updateTitleAndMenu(titleAndMenuStack.pop());

    this.props.navigator.pop();
  }

  handleError(error) {
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
  showErrorToastAndClear() {
    this.showToastMessage(this.props.error);
    this.props.clearError();
  }
  render() {
    console.log("Error-" + this.props.error);
    return (
      <ImageBackground source={this.getBackGroundImage()}
        ref="backgroundImage"
        style={styles.imageStyle}>

        <View style={styles.container}>

          <View style={{ flex: 1 }}>
            <ConnectivityRenderer>
                {
                    isConnected => {
                        if(isConnected) return null; return( <View style={styles.errorContainer}>
                        <CustomText style={{ color: '#901a1c' }}>
                            {Messages.NO_INTERNET}
                        </CustomText>
                      </View>);
                    }
                }
            </ConnectivityRenderer>
            <LoadingIndicator visible={this.props.isLoading} style={{zIndex:5}}/>

            <ScrollView
              ref="mainScrollView"
              style={{ flex: 1 ,zIndex: this.props.isConnected? 3: 1}}
              keyboardShouldPersistTaps={'always'}
              refreshControl={
                <RefreshControl
                  style={{ backgroundColor: 'transparent' }}
                  refreshing={false}
                  onRefresh={() => { this.reloadContent(); }}
                  tintColor="#003566"
                  title=""
                  enabled={this.state.refreshEnabled}
                  progressBackgroundColor="#fff"
                />
              }
            >
              {this.renderChild()}


            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    );
  }

  reloadContent() {
    //child should implement this if needed.
  }

  scrollToStart() {
    if (this.refs.mainScrollView) {
      this.refs.mainScrollView.getScrollResponder().scrollTo({ x: 0, y: 0, animated: false });
    }
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',

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
    zIndex: 2,
    backgroundColor: '#ffffff'
  }
});

export default BaseComponent;
