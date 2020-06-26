import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text
} from 'react-native';
import QPCard from './card/QPCard';
import CustomText from '../ui/CustomText';
import colorCodes from './typography/ColorCodes';

export default class LeaderBoardItemWidget extends Component {


    render() {
        return (

            <TouchableHighlight onPress={this.props.onPress}

                activeOpacity={0.6}
                underlayColor={'#CCCCCC'}>
                <View style={styles.mainContainer}>
                    <View style={styles.indexContainer}>
                        <View style={styles.indexParent}>
                            <CustomText style={styles.indexText}>{this.props.index}</CustomText>
                        </View>
                    </View>
                    <View style={styles.titleContainer}>

                        <CustomText style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                            {this.props.title}
                        </CustomText>
                        <CustomText style={styles.subtitle}>
                            {this.props.subtitle}
                        </CustomText>

                    </View>
                    <View style={styles.trendContainer} >
                        <CustomText style={styles.trend}>
                            {this.props.trend}
                        </CustomText>
                    </View>
                    <View style={styles.valueContainer}>


                        <CustomText style={styles.value}>
                            {this.props.value}
                        </CustomText>

                    </View>
                </View>
            </TouchableHighlight>

        );
    }

};

LeaderBoardItemWidget.defaultProps = {
    index: 0,
    title: 'Store 35',
    subtitle: '24 Responses',
    trend: '3',
    value: '42%'
};
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        marginTop: 0,
        flex: 1,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0
    },
    indexContainer: {
        flex: 0.15
    },
    indexParent: {
        flex: 1,
        backgroundColor: '#4575b8',
        alignItems: 'center',
        justifyContent: 'center'
    },

    indexText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center'


    },
    titleContainer: {
        flex: 0.5,
        justifyContent: 'center',
        paddingLeft: 10
    },
    title: {
        color: '#393939',
        fontSize: 16,
        textAlign: 'left'
    },
    subtitle: {
        fontSize: 10,
        color: '#b0b0b0',
        textAlign: 'left'
    },
    trendContainer: {
        flex: 0.05,
        justifyContent: 'center'
    },
    trend: {
        fontSize: 12,
        color: '#5da644',
        textAlign: 'center'
    },
    valueContainer: {
        flex: 0.3,
        justifyContent: 'center',
    },
    value: {
        color: '#3b3b3b',
        fontSize: 35,
        textAlign: 'center'
    }
});

