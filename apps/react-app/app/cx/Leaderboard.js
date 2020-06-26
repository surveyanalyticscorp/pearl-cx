import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableHighlight,
    ToolbarAndroid,
    ScrollView,
    ListView,
    NetInfo,
    DeviceEventEmitter,
    NativeEventEmitter,
    NativeModules
} from 'react-native';


import BaseComponent from '../global/components/BaseComponent';


import { apiHandler } from '../global/api/APIHandler';
import MainContainer from '../global/ui/MainContainer';
import LeaderBoardItemWidget from '../global/widgets/LeaderBoardItemWidget';
import CustomText from '../global/ui/CustomText';
import CXDashboard from './CXDashboard';
export default class LeaderBoard extends BaseComponent {


    renderView() {
        //if (this.state.dataLoaded) {

        // if (false) {
        //    // return this.renderNoDataFound();
        // }
        return this.renderSurveyList();
        //}

        //return (<View></View>)
    }

    renderChild() {

        let contents = this.renderView();

        return (
            <View style={{ flex: 1 }}>
                {contents}
            </View>
        );
    }
    renderNoDataFound() {
        return <CustomText>{this.state.data.noSurveyFoundMessage}</CustomText>
    }

    renderSurveyList() {
        let leaderboardItems = [
            {
                index: 1
            },
            {
                index: 2
            },
            {
                index: 3
            },
            {
                index: 4
            },
            {
                index: 5
            },
            {
                index: 6
            },

            {
                index: 7
            },
            {
                index: 8
            },
            {
                index: 9
            },
            {
                index: 10
            },
        ];
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                r1 != r2
            }
        });
        let listDataSource = dataSource.cloneWithRows(leaderboardItems);
        return (
            <ListView ref="surveyList" dataSource={listDataSource}
                renderRow={this.renderRow.bind(this)}
                renderSeparator ={this.renderSeparator.bind(this)}>
            </ListView>
        );

    }
    renderSeparator(survey){
        return(
            <View key={survey.index} style={{height:12, backgroundColor:'transparent'}}>
            </View>
        )
    }
    renderRow(survey) {
        return (
            <LeaderBoardItemWidget key={survey.index} index={survey.index} onPress={() => {
                this.handleItemSelect(survey.index);
                }
            } />
        );
    }

    handleItemSelect(index) {
        this.onPushScreen("Dashboard", CXDashboard, index,"String Dummy");
        console.log("Index->" + index)
    }

}


