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
import WebViewBridge from 'react-native-webview-bridge';
import colorCodes from './typography/ColorCodes';

const {height, width} = Dimensions.get('window');
export default class QPChartWidget extends Component {
    onBridgeMessage(message) {
        const dashboardWebView = this.refs.dashboardWebView;
        let messageObj = JSON.parse(message);

        console.log('webviewbridge: ' + dashboardWebView);
        console.log('this.state.data: ' + this.props.data);
        QPChartWidget.formatChartJSON(this.props.data);

        switch (messageObj.event) {
            case "getData":
                let data = {
                    question: this.props.data,
                    dimensions: QPChartWidget.getWebViewDimensions()
                };
                let jsonToString = JSON.stringify(data);
                console.log("jsonToString: " + jsonToString);
                dashboardWebView.sendToBridge(jsonToString);
        }
    }

    static formatChartJSON(question) {
        if (question.displayHighChart && question.chart.tooltip) {
            question.chart.tooltip.headerFormat = "";
            question.chart.tooltip.footerFormat = "";
            question.chart.tooltip.footerFormat = "";
            question.chart.tooltip.pointFormat = "{point.name} : {point.percentageValue:.2f}";
            question.chart.plotOptions.series.dataLabels.distance= -50;
            if(question.chart.chart.type=="pie"){
                question.chart.plotOptions.series.dataLabels.color = "#ffffff";
            }
            else{
                question.chart.plotOptions.series.dataLabels.enabled = false;
            }
            question.chart.plotOptions.series.dataLabels.connectorColor = "#00000000";
            question.chart.plotOptions.series.dataLabels.allowOverlap = false;
            question.chart.plotOptions.series.dataLabels.style.width = "100px";
            question.chart.plotOptions.series.dataLabels.style.fontSize = "13px";
            delete question.chart.chart.height;
        }
    }

    static getWebViewDimensions() {
        let {height, width} = Dimensions.get('window');
        let chartWidth = width;
        if (Platform.OS == 'ios') {
            chartWidth = width - 60;
        }

        return { height: 400, flex: 1 };
    }

    getWebViewURI() {
        if (Platform.OS != 'ios') {
            return { uri: 'file:///android_asset/highchart.html' }
        }

        let iosURL = { uri: 'highchart.html' };

        return iosURL;
    }

    checkHasDataAndRender() {
        if (!this.props.data.displayHighChart) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ffffff' }}>
                    <CustomText style={styles.noDataStyle}>No Data Found</CustomText>
                </View>
            );
        }
        let {height, width} = Dimensions.get('window');

        return (
            <View style={styles.mainContainer}>
                <View>
                    <WebViewBridge ref="dashboardWebView"
                        style={QPChartWidget.getWebViewDimensions()}
                        onBridgeMessage={(message) => { this.onBridgeMessage(message); } }
                        javaScriptEnabled={true}
                        scrollEnabled={false}
                        source={this.getWebViewURI()} />
                </View>
                <View style={{ marginTop: 8 }}>
                    <QPHorizontalSeparator />
                    <CustomText style={[styles.lastResponseText, colorCodes.secondaryFontColor]}>
                        {this.getResponseText()}
                    </CustomText>
                </View>
            </View>
        );
    }
    getNoOfResponses() {
        if (this.props.data.stats) {
            return this.props.data.stats.totalResponses;
        }
        return 0;
    }

    render() {
        return (
            <QPCard title={this.props.title} onPress={this.props.onPress}>
                <View style={styles.chartContainer}>
                    {this.checkHasDataAndRender()}
                </View>
            </QPCard>
        );
    }
    getResponseText() {
        return this.props.data.totalCount > 1 ? this.props.data.totalCount + ' Responses' :
            this.props.data.totalCount + ' Response';
    }
}


const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        flex: 1

    },
    chartStyle: {
        flex: 1
    },
    noDataStyle: {
        margin: 15
    },
    lastResponseText: {
        fontSize: 12,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15
    },
    chartContainer: {

        flex: 1
    }
});
