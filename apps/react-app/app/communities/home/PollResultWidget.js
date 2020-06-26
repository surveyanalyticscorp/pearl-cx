import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Platform,
    TouchableHighlight,
    ScrollView,
    Text,
    Dimensions
} from 'react-native';


import QPDonutWidget from '../../global/widgets/QPDonutWidget';

import CustomText from '../../global/ui/CustomText';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;


export default class PollResultWidget extends Component {
    constructor(props) {
        super(props);
    }
    renderTitle() {
        if (this.props.title) {
            return (<View style={styles.titleContainer} >
                <View style={{ flex: 1.0, justifyContent: 'center' }}>
                    <CustomText style={styles.titleText} ellipsizeMode='tail'>
                        {this.props.title}
                    </CustomText>
                </View>
            </View>);
        }
        return (<View></View>)
    }
    render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderTitle()}

                <View style={styles.content}>
                    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{height: Math.round(factor * 0.24) }}>
                            <QPDonutWidget radius={Math.round(factor * 0.12)} result={this.props.result} />
                        </View>
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 20, justifyContent: 'center', alignItems: 'flex-start' }} >
                        {this.getRemainingAnswers()}
                    </View>
                </View>

            </View>);
    }



    getRemainingAnswers() {
        var answersList = [];
        var remainingAnswers = this.props.result.answers.slice(1, this.props.result.answers.length);
        this.props.result.answers.map((item, index) => {
            console.log("Index: " + index);
            answersList.push(
                <View key={item.id} style={{ flexDirection: 'row' }}>
                    <CustomText numberOfLines={1} ellipsize={'tail'} style={{ textAlign: 'left', flex: 0.5, fontSize: 12, color: item.color, fontWeight: '400' }}>{item.text}:</CustomText>
                    <CustomText style={{ textAlign: 'right', flex: 0.25, fontSize: 12, color: item.color, fontWeight: '900' }}> {item.percentage}</CustomText>
                    <CustomText style={{ textAlign: 'right', flex: 0.25, fontSize: 12, color: '#4D5E75', fontWeight: '400' }}> {item.value}</CustomText>
                </View>

            )
        });
        return answersList;
    }

}
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#F7F7F7',

    },
    titleContainer: {
        backgroundColor: '#EEF0EF',
        padding: 5
    },
    titleText: {
        color: '#616970',
        justifyContent: 'center',
        marginLeft: 10,
        fontWeight: 'normal',
        fontSize: 14,
        fontStyle: 'italic'
    },
    content: {

        flex: 1,
        padding: 20,
        flexDirection: 'row',
        margin: 1
    },
});