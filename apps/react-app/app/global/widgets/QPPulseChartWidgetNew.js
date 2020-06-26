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
import PulseResultWidget from './PulseResultWidget';
const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;
const DONUT_COLOR = '#0097DC';
export default class QPPulseChartWidgetNew extends Component {


   

    checkHasDataAndRender() {

        return (
            <View>
                <View style={styles.chartStyle}>
                    {this.getFieldsData()}
                </View>
                <View style={{ marginTop: 2}}>
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
   
    getFieldsData() {
        let innercontents = [];
        let field = this.props.item;
        if(field.choiceAnalytics && field.choiceAnalytics.length && field.choiceAnalytics.length > 0) {
            field.choiceAnalytics.map((item, index) => {
                if (item.totalCount > 0 || item.individual) {
                    innercontents.push(
                        <PulseResultWidget key={'chart_' + field.fieldName + '_' + index} title={item.name}
                                           positivePercent={item.positivePercent}
                                           neutralPercent={item.neutralPercent}
                                           negativePercent={item.negativePercent}
                                           responseCount={item.totalCount}
                        />
                    );
                }
            });
        } else{
            innercontents.push(<View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                <CustomText style={{color: colorCodes.secondaryFontColor, fontSize: 16}}>No data found</CustomText>
            </View>)
        }

        return innercontents;

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
        padding: 5

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
