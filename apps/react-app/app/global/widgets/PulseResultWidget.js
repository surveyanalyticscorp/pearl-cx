import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Image,
    TouchableHighlight,
    Text,
    Dimensions
} from 'react-native';

import CustomText from '../ui/CustomText';
const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;
const chartHeight = 10;
export default class PulseResultWidget extends Component {
    constructor(props) {
        super(props);

    }
    render() {

        let positivePercent = Math.round(this.props.positivePercent);
        let neutralPercent = Math.round(this.props.neutralPercent);
        let negativePercent = Math.round(this.props.negativePercent);
        return (


            <View style={styles.mainContainer}>



                {this.props.title && this.props.responseCount &&
                    <View style={styles.titleContainer}>

                        <CustomText style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                            {this.props.title}
                        </CustomText>

                        <CustomText style={styles.value}>
                            {this.props.responseCount}
                        </CustomText>

                    </View>
                }

                <View style={styles.chartContainer}>

                    <View style={{ height: chartHeight, flex: positivePercent, backgroundColor: '#558b2f', justifyContent: 'center', alignItems: 'flex-start' }}>

                    </View>
                    {positivePercent > 0 && <View style={{ width: 1 }} />}
                    <View style={{ height: chartHeight, flex: neutralPercent, backgroundColor: '#ffd54f' }}></View>
                    {neutralPercent > 0 && <View style={{ width: 1 }} />}
                    <View style={{ height: chartHeight, flex: negativePercent, backgroundColor: '#CF3E3E' }}></View>
                    <CustomText style={{ position: 'absolute', left: 5, backgroundColor: 'transparent', color: 'white', fontSize: 8 }}>{Math.round(this.props.positivePercent)}%</CustomText>
                </View>

            </View>


        );
    }


};

PulseResultWidget.defaultProps = {

    positivePercent: 68,
    neutralPercent: 22,
    negativePercent: 10,

};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        marginTop: 0,
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        marginLeft: 0,
        paddingHorizontal: 10,
        paddingTop: 5,
        marginBottom: 10,
    },

    indexParent: {
        flex: 1,
        backgroundColor: '#4575b8',
        alignItems: 'center',
        justifyContent: 'center'
    },

    titleContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    title: {
        color: '#7e7e7e',
        fontSize: Math.round(factor * 0.035),
        textAlign: 'left',
        flex: 0.7,
    },

    chartContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        height: chartHeight,
        backgroundColor: '#f9f9f9',
        marginTop: 5

    },
    value: {
        color: '#7e7e7e',
        fontSize: Math.round(factor * 0.035),
        textAlign: 'right',
        flex: 0.3, marginRight: 2
    }
});



