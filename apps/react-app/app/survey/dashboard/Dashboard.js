/*jshint esversion: 6 */

import React, {Component} from 'react';
import {
    StyleSheet,
    ToolbarAndroid,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Dimensions
} from 'react-native';

import BaseComponent from '../../global/components/BaseComponent';
import {apiHandler} from '../../global/api/APIHandler';
import MainContainer from '../../global/ui/MainContainer';
import QPCard from '../../global/widgets/card/QPCard';
import CustomText from '../../global/ui/CustomText';
import QPChartWidget from '../../global/widgets/QPChartWidget';


export default class Dashboard extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            showLoader: false
        };
    }

    componentDidMount() {
        this.getSurveyDashboard();
    }

    getSurveyDashboard() {
        if (this.state.isConnected && !this.state.showLoader) {
            this.prepareForNetworkRequest();
            apiHandler.getSurveyDashboard((dashboard) => {
                let sections = dashboard.body.sections;
                this.setState({ sections: sections, dataLoaded: true , showLoader:false, error: false});
            }, { surveyID: this.props.data.ID },
            (error) => {
                this.handleError(error);
            });
        }
    }
    componentDidUpdate() {
        if (!this.state.dataLoaded && !this.state.error) {
            this.getSurveyDashboard();
        }
    }

    reloadContent(){
        this.getSurveyDashboard();
    }
    renderChild() {
        let contents;

        if (this.state.sections.length) {
            contents = this.state.sections.map((section) => {
                let sectionChart = section.questions.map((question, index) => {
                    let uniqueKey = question.questionID + '' + index;

                    return (
                        <View key={uniqueKey} style ={styles.chartContainer}>
                            <QPChartWidget sectionID={section.sectionID} title={section.title} data={question}/>
                        </View>
                    );
                });

                return (
                    <View key={section.sectionID}>
                        {sectionChart}
                    </View>
                )
            });
        }

        return (

            <View style={{ flex: 1 }}>
                {contents}
            </View>

        );
    }
};

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#2F9C0A',
        height: 56,
        alignSelf: 'stretch'
    },
    containerMain: {
        flex: 1,
        height: 200,

        alignSelf: 'stretch'
    },
    containerContent: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        margin: 5,
        alignSelf: 'stretch'
    },
    contentMain: {
        padding: 5
    },
    chartContainer: {
        marginLeft:15,
        marginRight: 15,
        marginTop:8,
        marginBottom:8
    }
    
});
