import React, { Component } from 'react';
import ReactNative from 'react-native';
import {
    StyleSheet,
    View,
    ScrollView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Dimensions,
    NativeModules,
    Platform
} from 'react-native';
const { height, width } = Dimensions.get('window');
const TEXT_COLOR = '#7e7e7e';
const DONUT_COLOR = '#0097DC';
import CustomText from '../../../global/ui/CustomText';
export default class BarChartView extends Component {
    constructor(props) {
        super(props);
        this.state = { barWidth: undefined }
    }

    render() {
        let fieldData = this.props.fieldData;
       // console.log("Title->" + fieldData.name + " And width->" + this.state.barWidth);
        return (
            <View style={{ backgroundColor: 'white', alignItems: 'center', paddingBottom: 50, justifyContent: 'flex-end',width:width - 20 }}>
                <CustomText numberOfLines={1} style={{ color: TEXT_COLOR, marginTop: 10, fontSize: global.h3FontSize }}>{fieldData.name}</CustomText>
                <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', marginTop: 10, marginHorizontal: 8 }}>
                    <View style={{ minHeight: height * 0.3, flexDirection: 'row', alignSelf: 'stretch', alignItems: 'flex-end' }}>
                        {this.getBars(fieldData.choices)}
                    </View>
                    <View style={{ alignSelf: 'stretch', height: 2, backgroundColor: TEXT_COLOR }} />
                    <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                        {this.getXValues(fieldData.choices)}
                    </View>
                </View>
            </View>
        );

    }

    getBars(choices) {
        let maxHeight = height * 0.3;
        let sum = 0;
        let max = 0;
        let contents = [];
        choices.map((item, index) => {
            sum += item.count;
            if (item.count >= max) {
                max = item.count;
            }
        });
        choices.map((item, index) => {
            let percent = (item.count / sum) * 100;
            let bheight = (percent / 100) * maxHeight ;
            if (isNaN(bheight) ) {
                bheight = 0
            }
            contents.push(
                <View key={'bar_' + index} style={{ flex: 1, backgroundColor: DONUT_COLOR, justifyContent: 'flex-start', alignItems: 'center', height: bheight, marginHorizontal: 2, }} onLayout={this.onLayout}>
                    {percent>4 && <CustomText style={{ color: 'white', fontFamily: global.semiBoldText, fontSize: global.h6FontSize }}>{Math.round(percent)}%</CustomText>}
                </View>
            );
        });
        return contents;
    }

    onLayout = event => {
        if (this.state.barWidth) {
            return;
        }
        let { width, height } = event.nativeEvent.layout;
        this.setState({ barWidth: width });
        //console.log("Width- > " + width);
    };
    getXValues(choices) {
        let contents = [];
        let rotation = choices.length>5? '-80deg': '0deg';
        if (this.state.barWidth) {
            choices.map((item, index) => {
                contents.push(
                    <View key={'X_' + index} style={{ flex: 1, height: height * 0.1, zIndex: -1, width: this.state.barWidth, marginHorizontal: 2, justifyContent: 'center',paddingVertical:5, alignItems: 'center', alignSelf: 'stretch' }}>
                        <CustomText numberOfLines={1}
                            style={{
                                color: TEXT_COLOR,
                                textAlign: 'right',
                                fontSize: global.h5FontSize,
                                transform: [{ rotate: rotation }],
                            }}>
                            {item.choiceName}
                        </CustomText>
                    </View>
                )
            })
        }
        return contents;
    }
}