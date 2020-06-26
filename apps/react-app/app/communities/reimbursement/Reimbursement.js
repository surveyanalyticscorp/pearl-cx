import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View
} from 'react-native';

const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions/index';
import {ActionBarModule} from "../../global/native-modules/NativeModules";
import BaseComponentWithoutScroll from "../../global/components/BaseComponentWithoutScroll";
import {Actions} from "react-native-router-flux";
import SurveyCategoryList from "../surveys/common/SurveyCategoryList";
import ReimbrusementSurveyList from "./ReimbrusementSurveyList";
var dataJSON = {};
export const R_Log_ID = 2578501;

class Reimbursement extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            dataLoaded: false,
            showLoader: false,
        };
        this.takeSurveyRequested = false;
        this.processAPIResponse = this.processAPIResponse.bind(this);
    }

    componentDidMount() {
        ActionBarModule.updateTitleAndMenu(JSON.stringify({title: "Reimbursement"}));
        if (Object.keys(this.props.surveysPanelData).length === 0) {
            this.callGetAPIForPanelMemberSurveys();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        ActionBarModule.updateTitleAndMenu(JSON.stringify({title: "Reimbursement"}));
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
        this.setState({dataLoaded: true, error: false, showLoader: false});
    }

    componentWillMount() {
        super.componentWillMount();
    }

    /** Rendering cycles*/

    handleTakeSurvey(survey) {
        this.takeSurveyRequested = true;
        Actions.takesurveys({survey: survey, title: survey.title});
    }

    getCategories() {
        if (Object.keys(this.props.surveysPanelData).length === 0) {
            return [];
        }
        let pendingArray = this.props.surveysPanelData.surveys.pending ? this.props.surveysPanelData.surveys.pending : [];
        let category = pendingArray.filter(item => R_Log_ID === item.folderID)
        let startedArray = this.props.surveysPanelData.surveys.started ? this.props.surveysPanelData.surveys.started : [];
        startedArray = startedArray.filter(item => R_Log_ID === item.folderID)
        for (let startedCount = 0; startedCount < startedArray.length; startedCount++) {
            category.push(startedArray[startedCount])
        }
        return category;
    }

    renderChild() {
        const categories = this.getCategories();
        return (<View style={{flex: 1}}>
            <ReimbrusementSurveyList
                   {...this.props}
        selectAction={(data) => {
            if (this.props.isConnected && data.category) {
                this.handleTakeSurvey(data.category);
            }
        }}
        itemLabel="title"
        countLabel="topicCount"
        categories={categories}
        totalCount={0}
        reload={() => {
            this.callGetAPIForPanelMemberSurveys();
        }}
        />
        </View>
    );
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

function mapDispatchToProps(dispatch) {
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


export default connect(mapStateToProps, mapDispatchToProps)(Reimbursement);
