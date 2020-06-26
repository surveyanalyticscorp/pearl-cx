import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    Platform,
    WebView
} from 'react-native';

import QPCard from './card/QPCard';
import CustomText from '../ui/CustomText';
import QPHorizontalSeparator from './card/QPHorizontalSeparator';
import colorCodes from './typography/ColorCodes';
import { utils } from '../Utils'
import QPDonutWithPercent from './QPDonutWithPercent';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
const DONUT_COLOR = '#0097DC';
export default class QPPulseChartWidget extends Component {
    onBridgeMessage(message) {
        const dashboardWebView = this.refs.dashboardWebView;
        let messageObj = JSON.parse(message);

        console.log('webviewbridge: ' + dashboardWebView);
        console.log('this.state.data: ' + this.props.data);
        QPPulseChartWidget.formatChartJSON(this.props.data);
        switch (messageObj.event) {
            case "getData":
                let data = {
                    question: this.props.data.positiveResult,
                    color: "#10518d",
                    dimensions: QPPulseChartWidget.getWebViewDimensions(),

                };
                let jsonToString = JSON.stringify(data);
                console.log("jsonToString: " + jsonToString);
                dashboardWebView.sendToBridge(jsonToString);
        }
    }

    static formatChartJSON(question) {
        if (question.positiveResult) {

            question.positiveResult.chart.plotOptions.series = {
                states: {
                    hover: {
                        enabled: false
                    }
                }
            };
            question.positiveResult.chart.plotOptions.pie.dataLabels.enabled = false;
            question.positiveResult.chart.plotOptions.pie.innerSize = "80%";
        }



    }
    static getWebViewDimensions() {
        let {height, width} = Dimensions.get('window');
        let chartWidth = width;
        if (Platform.OS == 'ios') {
            chartWidth = width - 60;
        }

        return { flex: 1, height: 250 };
    }

    getWebViewURI() {
        if (Platform.OS != 'ios') {
            return { uri: 'file:///android_asset/donutchart.html' }
        }

        let iosURL = { uri: 'donutchart.html' };

        return iosURL;
    }

    checkHasDataAndRender() {
        radius = Math.round(factor * 0.2);
	    return (
            <View>
                <View style={styles.chartStyle}>
                    <QPDonutWithPercent radius={radius} borderWidth={20} percent={this.round(this.props.data,1)} color={DONUT_COLOR}
                    />
                </View>
                <View style={{ marginTop: 8 }}>
                    <QPHorizontalSeparator />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <CustomText style={[styles.lastResponseText, colorCodes.secondaryFontColor]}>
                                {this.getQuestionDate()}
                            </CustomText>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <CustomText style={[styles.lastResponseText, colorCodes.secondaryFontColor]}>
                                {this.getResponsesText()}
                            </CustomText>
                        </View>
                    </View>
                </View>
            </View>
        );

    }
    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
    getResponsesText() {
        let count = (this.props.responseCount) ? this.props.responseCount : 1;
        if (count > 1) {
            return count + " Responses";
        }
        return count + " Response";
    }
    render() {

        return (

            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ffffff' }}>
                {this.checkHasDataAndRender()}
            </View>

        );

    }

    getQuestionDate() {
        console.log("Time> " + this.props.timeStamp);
        var objDate = new Date(this.props.timeStamp);
        return utils.getShortMonthNameFromDate(objDate) + " " + utils.getDateWithSuffix(objDate);
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    chartStyle: {
        flex: 1,
        alignItems: 'center',
        padding: 10

    },
    noDataStyle: {
        color: '#7e7e7e',
        margin: 15,

    },
    lastResponseText: {
        color: '#7e7e7e',
        fontSize: 12,
        marginLeft: 18,
        marginRight: 18,
        marginTop: 8,
        marginBottom: 8
    }
});
