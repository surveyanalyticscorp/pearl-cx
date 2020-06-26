import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions/index';
import {ActionBarModule} from "../../global/native-modules/NativeModules";
import QPTabView from "../QPTabView";
import BaseComponentWithoutScroll from "../../global/components/BaseComponentWithoutScroll";
import NewSurveyTab from "./SurveyTabScenes/NewSurveyTab";
import {Actions} from "react-native-router-flux";
import {R_Log_ID} from "../reimbursement/Reimbursement";
import I18n from "react-native-i18n";
var dataJSON = {};

class SurveysTab extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);

        let useTranslationForTabs = true;

        if(global.appUser.useTranslationsForTabs){
            useTranslationForTabs = global.appUser.useTranslationsForTabs ==='true';
        }


        this.state = {
            error: false,
            dataLoaded: false,
            requestData: {},
            showLoader: false,
            index: 0,
            responseData: {history: [], survey: {pending: [], started: []}},
            routes: [{key: '1', title: useTranslationForTabs?  I18n.t("new", {locale: props.language})
                    : "New" },
                {key: '2', title: useTranslationForTabs?  I18n.t("started", {locale: props.language})
                        :  "Started"},
                {key: '3', title: useTranslationForTabs?  I18n.t("finished", {locale: props.language})
                        : "Finished"}],
        };
        this.takeSurveyRequested = false;
        this.previousTab = 1;
        this.currentTab = 1;
        this.finishedData = [];
        this.newData = [];
        this.startedData = [];
        this.processAPIResponse = this.processAPIResponse.bind(this);
    }

    componentDidMount() {
        //ActionBarModule.updateTitleAndMenu(JSON.stringify({title:"Surveys"}));
        this.fillData(this.props.surveysPanelData);
        this.callGetAPIForPanelMemberSurveys();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //ActionBarModule.updateTitleAndMenu(JSON.stringify({title:"Surveys"}));
        if (this.takeSurveyRequested) {
            this.takeSurveyRequested = false;
            this.callGetAPIForPanelMemberSurveys();
        }
    }

    callGetAPIForPanelMemberSurveys() {
        this.props.callApiForPanelMemberSurvey({}).then(this.processAPIResponse);
    }

    processAPIResponse(response) {
        dataJSON = JSON.stringify(response);
        let body = response.body
        this.fillData(body)
    }

    fillData(surveysPanelData) {
        if (Object.keys(surveysPanelData).length !== 0 ) {
            let pendingSurvey = surveysPanelData.surveys.pending ? surveysPanelData.surveys.pending : []
            let pendingData = pendingSurvey.filter( item => R_Log_ID !== item.folderID);
            let finishedFilteredData = surveysPanelData.history ? surveysPanelData.history : []
            finishedFilteredData = finishedFilteredData.filter( item => R_Log_ID !== item.folderID);
            let startedFiltered = surveysPanelData.surveys.started ? surveysPanelData.surveys.started : [];
            startedFiltered = startedFiltered.filter( item => R_Log_ID !== item.folderID);
            this.finishedData = finishedFilteredData;
            this.newData = pendingData;
            this.startedData = startedFiltered;
            this.setState({dataLoaded: true, error: false, showLoader: false });
        }
    }

    componentWillMount() {
        super.componentWillMount();
    }

    _handleChangeTab = (index) => {
        this.previousTab = this.currentTab;
        this.currentTab = index;
        this.setState({
            index,
        });

    };


    getCategories = (key) => {
        switch (key) {
            case '1':
                return {categories:  this.newData};
            case '2':
                return {categories: this.startedData};
            case '3':
                return {categories: this.finishedData};
            default:
                return {categories: []};
        }
     }

    handleTakeSurvey(survey) {
        this.takeSurveyRequested = true;
        Actions.takesurvey({survey: survey, title: survey.title});
    }

    /** Rendering cycles*/
    _renderScene = ({route}) => {
        if (this.state.index == this.state.routes.indexOf(route)) {
            const routeProps = this.getCategories(route.key)
            return  ( <NewSurveyTab {...routeProps}
                                    {...this.props}
                                    routeKey={route.key}
                                    surveySelected={(data) => {
                                       if (this.props.isConnected && data.category) {
                                       this.handleTakeSurvey(data.category);
                                    }
            }}
            onPress={(data) => {
                this.callGetAPIForPanelMemberSurveys();
            }}/>);
        }
    };

    renderChild() {
        return ( <QPTabView navigationState={this.state}
                       renderScene={this._renderScene}
                       onIndexChange={this._handleChangeTab} /> );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#F9F9F9',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    titleContainer: {
        backgroundColor: '#EEF0EF',
        height: Math.round(factor * 0.10)
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
        flexDirection: 'row',

    },
});

function mapDispatchToProps(dispatch)
{
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        surveysPanelData: state.panelSurveyTabData.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysTab);
