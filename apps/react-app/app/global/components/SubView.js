import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Navigator,
    Image,
    NetInfo,
    Platform,
    RefreshControl,
    ScrollView,
    DeviceEventEmitter,
    ActivityIndicator,
    NativeEventEmitter,
    NativeModules
} from 'react-native';
import CustomText from '../ui/CustomText';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
export default class SubViewBaseComponent extends Component {
    getBackIconImage() {
        if (Platform.OS != 'ios') {
            return require('../images/left_arrow_grey.png');
        } else {
            return { uri: 'left_arrow_grey.png' };
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.getTopBar()}
                <View style={{ flex: 1 }}>
                    {this.props.children}
                </View>
            </View>);
    }

    getTopBar(){
        if(this.props.renderTopBar){
            return this.props.renderTopBar;
        }
        else{
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 10, paddingVertical:10 }}>
                    <View style = {{
                        flex: 1,
                        backgroundColor: '#00000000',
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                        position: 'absolute', top: 0,
                        bottom: 0,
                        left: 0,
                        paddingHorizontal: 60,
                        right: 0,
                    }}>
                        <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, textAlign: 'center', color: '#7d93ab', fontSize: 20 }}>{this.props.title}</CustomText>
                    </View>
            <Button onPress={() => {
                        if(this.props.onPress){
                            this.props.onPress();
                        }
                        else {
                            Actions.pop();
                        }
                    }}>
                        <View  style = {{backgroundColor:'#FFFFFF', padding:5,flexDirection:'row', alignItems:'center' }}>
                            <Image source={this.getBackIconImage()} style={{ backgroundColor: '#FFFFFF', height: 15, width: 15 }} />
                            {this.props.backText && <CustomText style={{marginHorizontal:2}}>{this.props.backText}</CustomText>}
                        </View>
                    </Button>
                </View>
            );
        }
    }
}
