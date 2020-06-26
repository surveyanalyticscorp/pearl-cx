import React, {Component} from 'react';
import {Image, StyleSheet, View, Dimensions, Platform, ScrollView} from 'react-native';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import CustomText from "../../../global/ui/CustomText";

import LinearGradient from 'react-native-linear-gradient';
import QPCard from "../../../global/widgets/card/QPCard";
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
export default class PathFinderResults extends Component {
    constructor(props) {
        super(props);
        // this.results = [{
        //     "question": "Which sport do you prefer?",
        //     "name": "Sports",
        //     "id": 1,
        //     "items": [{"name": "Gilli-Danda", "id": 14}, {"name": "Tennis", "id": 17}, {
        //         "name": "Cricket",
        //         "id": 8
        //     }, {"name": "Baseball", "id": 16}, {"name": "Table-Tennis", "id": 12}, {
        //         "name": "Football",
        //         "id": 9
        //     }, {"name": "Golf", "id": 13}, {"name": "Archery", "id": 11}, {
        //         "name": "Hockey",
        //         "id": 15
        //     }, {"name": "Swimming", "id": 10}]
        // },
        //     {
        //         "question": "Which hobby do you prefer?",
        //         "name": "Hobbies",
        //         "id": 2,
        //         "items": [{"name": "Gilli-Danda", "id": 14}, {"name": "Tennis", "id": 17}, {
        //             "name": "Cricket",
        //             "id": 8
        //         }, {"name": "Baseball", "id": 16}, {"name": "Table-Tennis", "id": 12}, {
        //             "name": "Football",
        //             "id": 9
        //         }, {"name": "Golf", "id": 13}, {"name": "Archery", "id": 11}, {
        //             "name": "Hockey",
        //             "id": 15
        //         }, {"name": "Swimming", "id": 10}]
        //     }]
    }

    render() {
        const {pathFinderResultsData} = this.props;
        if(pathFinderResultsData) {
            let contents = [];
            pathFinderResultsData.map((item, index) => {
                contents.push(this.getResultItem(item, index))
            });

            return (
                <View style={{margin: 10}}>
                    {contents}
                </View>
            )
        }
        return (<View/>);
    }

    getResultItem(pathFinder, index) {
        let rows = [];
        pathFinder.items.slice(0,3).map((item, index) => {
            rows.push(this.getRowContent(item, index + 1));
        })

        return (
            <QPCard key={"card_" + index} title={pathFinder.question} style={styles.card}
                    titleTextStyle={{fontSize: 18}}
                    titleBackgroundStyle={{backgroundColor: '#efefef'}}>
                <View style={{borderWidth: 1,borderTopWidth:0, borderColor: '#efefef', paddingBottom:15}} >
                    {rows}
                </View>
            </QPCard>
        )
    }

    getRowContent(rowItem, index) {
        return (
            <View key={"row_" +rowItem.id+"_"+ index} style={styles.row} >

                    <CustomText style={styles.indexText}>{index}</CustomText>
                    <CustomText style={styles.rowText}>{rowItem.name}</CustomText>

            </View>
        );

    }
}


const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
    },
    questionSection: {
        flex: 0.3,
        backgroundColor: '#4CC5FD',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 10
    },
    questionText: {
        color: 'white',
        fontSize: Math.round(factor * 0.1),
        textAlign: 'center'
    },
    indexText: {
        marginLeft: 5,
        color: '#2DAEFD',
        ...Platform.select({
            android: {
                fontWeight: '300'
            },ios:{
                fontWeight: '900'
            }}),
        fontSize: 16,
        textAlign: 'center',
        marginRight: 5
    },
    header: {
        backgroundColor: '#2DAEFD',
        flexDirection: 'row',
        minHeight: 70,
        alignSelf: 'stretch',
        paddingHorizontal: 40,
        paddingBottom: 10,

    },
    rowText: {
        color: '#2DAEFD',
        ...Platform.select({
            android: {
               fontWeight: '300'
            },ios:{
                fontWeight: '900'
                }}),
        marginHorizontal: 5,
        textAlign: 'left',
        fontSize: 16,
    },
    row: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal : 10,
        alignSelf: 'stretch',
    }
})