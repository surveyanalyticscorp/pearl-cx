import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import CustomText from '../ui/CustomText';
import QPDonutNPSWidget from './QPDonutNPSWidget';

export default class QPDonutWithExponent extends Component {
    getImageUrl() {
        if (this.props.sentiment === 'positive') {
            //if (Platform.OS != 'ios') {
            return require('../images/up_arrow.png');
            //} else {
            //    return { uri: 'up_arrow.png' };
            //}
        }
        else{
            return require('../images/down_arrow.png');
        }

        //return null;
    };
    render() {
        var height = Math.round(this.props.radius * 2.4/ 3);

        return (


            <View>
                <QPDonutNPSWidget radius={this.props.radius} 
                    borderWidth={this.props.borderWidth} percent={this.props.percent} 
                    color={this.props.color}
                    passiveColor={this.props.passiveColor} 
                    detractorColor={this.props.detractorColor}
                    promoter = {this.props.promoter}
                    passive = {this.props.passive}
                    detractor = {this.props.detractor}
                    fontSize={this.props.fontSize}></QPDonutNPSWidget>
               
            </View>

        );
    }
};
QPDonutWithExponent.defaultProps = {
    radius: 90,
    borderWidth: 20,
    percent: 86,
    color: '#90BA5B',
    passiveColor: '#E8E8E8',
    detractorColor: '#CE3E3E',
    exponentPercent: 0,
    sentiment: 'positive'

};
const styles = StyleSheet.create({

    circle: {
        flexDirection: 'row',
        position: 'absolute',
        
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowColor: '#3C637D',
        shadowOpacity: 1.0,
        elevation: 5
    },
    exponent: {
        color: 'white',
        fontWeight: 'bold',

    }
});